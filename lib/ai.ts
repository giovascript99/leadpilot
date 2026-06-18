import { GoogleGenAI } from "@google/genai";
import { businessConfig } from "@/config/business";
import type { Categoria, QualificationResult, SlotAppuntamento, Lead } from "./types";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * Prezzi USD per milione di token (input, output) dei modelli supportati.
 * Nota: il tier gratuito di Google AI Studio copre un volume generoso a costo
 * zero; questi prezzi servono solo per la stima "a regime" su piano a pagamento.
 */
const PREZZI_MTOK: Record<string, [number, number]> = {
  "gemini-2.5-flash": [0.3, 2.5],
  "gemini-2.5-flash-lite": [0.1, 0.4],
  "gemini-2.5-pro": [1.25, 10],
  "gemini-2.0-flash": [0.1, 0.4],
};

export interface UsageInfo {
  input_tokens: number;
  output_tokens: number;
  costo_usd: number;
}

function calcolaUsage(input_tokens: number, output_tokens: number): UsageInfo {
  const [pIn, pOut] = PREZZI_MTOK[MODEL] ?? [0.3, 2.5];
  return {
    input_tokens,
    output_tokens,
    costo_usd: (input_tokens * pIn + output_tokens * pOut) / 1_000_000,
  };
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY non configurata. Copia .env.example in .env e inserisci la chiave (gratuita da https://aistudio.google.com/apikey)."
    );
  }
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Traduce un errore della chiamata AI in un messaggio chiaro per l'utente. */
export function messaggioErrore(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("GEMINI_API_KEY")) return msg;
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
    return "Troppe richieste in poco tempo (limite del piano gratuito). Riprova tra un minuto.";
  }
  if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
    return "Il servizio AI è sovraccarico in questo momento. Riprova tra qualche istante.";
  }
  return "Servizio AI momentaneamente non disponibile. Riprova tra qualche istante.";
}

type GenerateRequest = Parameters<GoogleGenAI["models"]["generateContent"]>[0];

/** Errori transitori che vale la pena ritentare. */
function isErroreTransitorio(msg: string): boolean {
  return (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") || // rate limit (tier gratuito: ~5/min)
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") || // modello sovraccarico, picco di domanda
    msg.includes("500") ||
    msg.includes("INTERNAL")
  );
}

/**
 * Chiama il modello con retry su errori transitori (rate limit 429, overload
 * 503): onora il retryDelay suggerito dal server quando presente, altrimenti
 * usa un backoff crescente (con un tetto per non bloccare troppo a lungo).
 */
async function generateWithRetry(req: GenerateRequest, retries = 3) {
  const ai = getClient();
  for (let attempt = 0; ; attempt++) {
    try {
      return await ai.models.generateContent(req);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!isErroreTransitorio(msg) || attempt >= retries) throw err;
      const suggested = msg.match(/"retryDelay":"(\d+(?:\.\d+)?)s"/);
      const waitMs = suggested
        ? Math.min(Math.ceil(parseFloat(suggested[1]) * 1000) + 500, 20_000)
        : (attempt + 1) * 2_500;
      await sleep(waitMs);
    }
  }
}

/** Calcola i prossimi N giorni lavorativi (lun-ven) a partire da domani. */
export function prossimiGiorniLavorativi(n: number): SlotAppuntamento[] {
  const giorni = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const mesi = [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
  ];
  const orari = ["10:00", "15:00", "11:30"];
  const slots: SlotAppuntamento[] = [];
  const d = new Date();
  while (slots.length < n) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue;
    slots.push({
      giorno: `${giorni[dow]} ${d.getDate()} ${mesi[d.getMonth()]}`,
      ora: orari[slots.length % orari.length],
    });
  }
  return slots;
}

/** Estrae il primo oggetto JSON valido da una risposta testuale del modello. */
export function parseJsonDifensivo(text: string): Record<string, unknown> {
  let candidate = text.trim();
  // rimuove eventuali code fence ```json ... ```
  candidate = candidate.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("La risposta del modello non contiene JSON");
  }
  return JSON.parse(candidate.slice(first, last + 1)) as Record<string, unknown>;
}

const CATEGORIE: Categoria[] = ["caldo", "tiepido", "freddo", "spam"];

/**
 * Normalizza l'output grezzo del modello in un risultato sicuro:
 * clamp dello score, categoria validata con fallback, slot di riserva,
 * ed enforcement della regola "spam = nessuna risposta".
 */
export function normalizzaRisultato(raw: Record<string, unknown>): QualificationResult {
  const scoreNum = Number(raw.score);
  const score = Number.isFinite(scoreNum) ? Math.min(100, Math.max(0, Math.round(scoreNum))) : 0;

  const catRaw = String(raw.categoria ?? "").toLowerCase().trim();
  const categoria: Categoria = CATEGORIE.includes(catRaw as Categoria)
    ? (catRaw as Categoria)
    : score >= 70 ? "caldo" : score >= 40 ? "tiepido" : "freddo";

  let slots: SlotAppuntamento[] = [];
  if (Array.isArray(raw.slot_proposti)) {
    slots = (raw.slot_proposti as unknown[])
      .filter((s): s is { giorno: unknown; ora: unknown } => !!s && typeof s === "object")
      .map((s) => ({ giorno: String(s.giorno ?? ""), ora: String(s.ora ?? "") }))
      .filter((s) => s.giorno && s.ora)
      .slice(0, 3);
  }
  if (slots.length < 3) slots = prossimiGiorniLavorativi(3);

  // Enforcement: lo spam non riceve mai una bozza di risposta né slot,
  // qualunque cosa abbia generato il modello.
  if (categoria === "spam") {
    return {
      score,
      categoria,
      esigenza: String(raw.esigenza ?? "Messaggio non pertinente"),
      budget: null,
      urgenza: "non indicata",
      bozza_email: "",
      slot_proposti: [],
    };
  }

  return {
    score,
    categoria,
    esigenza: String(raw.esigenza ?? "Non specificata"),
    budget: raw.budget != null && String(raw.budget).trim() !== "" ? String(raw.budget) : null,
    urgenza: String(raw.urgenza ?? "non indicata"),
    bozza_email: String(raw.bozza_email ?? ""),
    slot_proposti: slots,
  };
}

export async function qualificaLead(input: {
  nome: string;
  email: string;
  telefono?: string;
  messaggio: string;
}): Promise<{ risultato: QualificationResult; usage: UsageInfo }> {
  const c = businessConfig;
  const slotsSuggeriti = prossimiGiorniLavorativi(3);

  const prompt = `Sei l'assistente AI di qualificazione lead di "${c.nomeAzienda}", azienda nel settore: ${c.settore}.

SERVIZI OFFERTI:
${c.descrizioneServizi}

CRITERI DI QUALIFICAZIONE:
- Budget minimo interessante: ${c.criteriQualificazione.budgetMinimo}
- Zona operativa: ${c.criteriQualificazione.zonaOperativa}
- Richieste ideali: ${c.criteriQualificazione.tipiRichiestaIdeali.join("; ")}
- Note: ${c.criteriQualificazione.note}

NUOVO LEAD DAL FORM DEL SITO:
- Nome: ${input.nome}
- Email: ${input.email}
- Telefono: ${input.telefono || "non fornito"}
- Messaggio: """${input.messaggio}"""

COMPITO — rispondi SOLO con un oggetto JSON valido, nessun altro testo, con questi campi:
{
  "score": <numero intero 0-100>,
  "categoria": <"caldo" | "tiepido" | "freddo" | "spam">,
  "esigenza": <sintesi in 1 frase, in italiano, dell'esigenza del cliente>,
  "budget": <budget menzionato nel messaggio, es. "25.000 €", oppure null se non menzionato>,
  "urgenza": <"alta" | "media" | "bassa" | "non indicata">,
  "bozza_email": <bozza di risposta secondo le REGOLE EMAIL sotto>,
  "slot_proposti": ${JSON.stringify(slotsSuggeriti)}
}

SCALA SCORE (àncorati a questi riferimenti, distanzia i casi diversi):
- 85-100 → caldo: in target, budget esplicito ≥ minimo E tempistica/urgenza chiara
- 70-84  → caldo: in target con budget O tempistica chiari, manca solo un dettaglio
- 45-69  → tiepido: probabilmente in target ma mancano informazioni chiave (budget, zona, perimetro)
- 20-44  → freddo: richiesta vaga senza dettagli utili, oppure CHIARAMENTE e con certezza fuori zona/fuori target
- 0-19   → spam: pubblicità, messaggi irrilevanti, tentativi di vendita verso di noi
Una richiesta generica ("vorrei informazioni") non può superare 40. Errori di ortografia o grammatica del lead NON abbassano lo score: conta solo il contenuto.

REGOLE ANTI-SOTTOVALUTAZIONE (un buon lead non va perso per un tecnicismo):
- Zona incerta/di confine: se la località rilevante NON è chiaramente fuori dalla zona operativa, o non è proprio indicata, NON trattarla come "fuori zona". In dubbio assegna "tiepido" e CHIEDI di confermare la località — non scartare a "freddo".
- Operazione di valore: un lead con budget ≥ al minimo E una transazione concreta (vendita e/o acquisto con cifre indicate) NON può scendere sotto "tiepido" per sola incertezza sulla zona o mancanza di tempistica. Al massimo è tiepido con una domanda di chiarimento.
- In un'operazione doppia (vendi+compra), la zona dell'immobile da VENDERE conta più di quella dell'immobile da comprare; se la prima non è indicata, chiedila invece di assumere "fuori zona".

REGOLE EMAIL (vincolanti, in ordine di priorità):
1. Se categoria è "spam": "bozza_email" deve essere esattamente "" (stringa vuota). Nessuna risposta.
2. NON inventare MAI nulla che non sia scritto sopra: niente prezzi, costi al mq, sconti, garanzie, numeri di telefono, riferimenti a "firme" o allegati, figure professionali (architetti, geometri…) o servizi non elencati in SERVIZI OFFERTI. Se il lead chiede qualcosa che non sai, rimanda al sopralluogo.
3. Scrivi nella lingua del messaggio del lead (default: italiano).
4. Tono ${c.tonoRisposte}. Firma semplicemente "${c.nomeAzienda}".
5. Se categoria è "caldo" o "tiepido" con esigenza chiara: massimo 120 parole, personalizza sul messaggio e proponi un sopralluogo con questi 3 slot: ${slotsSuggeriti.map((s) => `${s.giorno} ore ${s.ora}`).join(", ")}.
6. Se la richiesta è vaga o "freddo" ma potenzialmente recuperabile: massimo 60 parole, fai UNA SOLA domanda di chiarimento (quella più utile per qualificare il lead), niente slot, niente elenco dei servizi.
7. Se "freddo" perché CON CERTEZZA fuori zona o fuori target: declino cortese in massimo 60 parole, senza slot. Se invece la zona è solo incerta o non indicata (vedi REGOLE ANTI-SOTTOVALUTAZIONE), NON declinare: applica la regola 6 e chiedi di confermare la località.`;

  const response = await generateWithRetry({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
      // Niente "thinking": la qualificazione è un compito strutturato e veloce.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const text = response.text ?? "";
  const u = response.usageMetadata;
  const usage = calcolaUsage(
    u?.promptTokenCount ?? 0,
    (u?.candidatesTokenCount ?? 0) + (u?.thoughtsTokenCount ?? 0)
  );
  console.log(
    `[qualificaLead] token in=${usage.input_tokens} out=${usage.output_tokens} costo=$${usage.costo_usd.toFixed(5)}`
  );

  return { risultato: normalizzaRisultato(parseJsonDifensivo(text)), usage };
}

export async function generaReportSettimanale(leads: Lead[]): Promise<string> {
  const c = businessConfig;
  const riepilogo = leads.map((l) => ({
    data: l.created_at,
    score: l.score,
    categoria: l.categoria,
    esigenza: l.esigenza,
    budget: l.budget,
    urgenza: l.urgenza,
    stato: l.stato,
  }));

  const prompt = `Sei il consulente AI di "${c.nomeAzienda}" (settore: ${c.settore}).

Ecco i lead ricevuti e qualificati automaticamente (JSON):
${JSON.stringify(riepilogo, null, 2)}

Scrivi un REPORT SETTIMANALE in italiano per il titolare dell'azienda. Tono ${c.tonoRisposte} ma diretto e orientato al business. Struttura il report in Markdown con queste sezioni:

## Andamento lead
Numeri chiave: totale, distribuzione caldi/tiepidi/freddi/spam, qualità media.

## Temi ricorrenti
Le esigenze e i pattern che emergono dai messaggi (tipologie di lavori, budget tipici, urgenze).

## Suggerimenti operativi
3-5 azioni concrete e prioritizzate per convertire più lead (es. chi richiamare subito, cosa migliorare nel form o nell'offerta).

Sii specifico: cita i dati reali. Massimo 400 parole.`;

  const response = await generateWithRetry({
    model: MODEL,
    contents: prompt,
    config: { temperature: 0.6 },
  });

  return (response.text ?? "").trim();
}
