/**
 * Collaudo live del motore di qualificazione.
 * Invia 8 messaggi realistici al modello (stesso codice dell'endpoint POST /api/leads,
 * senza scrivere nel DB così la demo resta pulita) e stampa il risultato completo.
 * I casi sono selezionati automaticamente in base al settore del preset attivo.
 *
 * Uso: npm run test:leads
 */
process.loadEnvFile(".env");

import { qualificaLead, type UsageInfo } from "../lib/ai";
import { businessConfig } from "../config/business";
import type { QualificationResult } from "../lib/types";
import type { CasoTest } from "./test-cases/tipi";
import { casiEdilizia } from "./test-cases/edilizia";
import { casiImmobiliare } from "./test-cases/immobiliare";

const isImmobiliare = /immobiliar/i.test(businessConfig.settore);
const casi: CasoTest[] = isImmobiliare ? casiImmobiliare : casiEdilizia;

function stampa(caso: CasoTest, r: QualificationResult, usage: UsageInfo) {
  const linea = "─".repeat(72);
  console.log(`\n${linea}`);
  console.log(caso.etichetta);
  console.log(`Atteso: ${caso.atteso}`);
  console.log(linea);
  console.log(`  Messaggio : ${caso.messaggio.slice(0, 100)}${caso.messaggio.length > 100 ? "…" : ""}`);
  console.log(`  Score     : ${r.score}`);
  console.log(`  Categoria : ${r.categoria}`);
  console.log(`  Esigenza  : ${r.esigenza}`);
  console.log(`  Budget    : ${r.budget ?? "—"}`);
  console.log(`  Urgenza   : ${r.urgenza}`);
  console.log(`  Token     : in=${usage.input_tokens} out=${usage.output_tokens} → $${usage.costo_usd.toFixed(5)}`);
  console.log(`  Bozza email (${r.bozza_email.length} caratteri):`);
  if (r.bozza_email) {
    for (const riga of r.bozza_email.split("\n")) console.log(`    │ ${riga}`);
  } else {
    console.log("    │ (vuota)");
  }
}

async function main() {
  console.log(
    `Collaudo qualificazione lead — 8 casi live (settore: ${isImmobiliare ? "immobiliare" : "edilizia"}, brand: ${businessConfig.nomeAzienda})\n`
  );
  const risultati: { caso: CasoTest; r: QualificationResult; usage: UsageInfo }[] = [];

  // Il tier gratuito Gemini consente ~5 richieste/minuto: distanziamo le
  // chiamate di 14s per non incappare nel rate limit (429) durante il collaudo.
  const PAUSA_MS = 14_000;
  for (let i = 0; i < casi.length; i++) {
    const caso = casi[i];
    try {
      const { risultato, usage } = await qualificaLead({
        nome: caso.nome,
        email: caso.email,
        telefono: caso.telefono,
        messaggio: caso.messaggio,
      });
      risultati.push({ caso, r: risultato, usage });
      stampa(caso, risultato, usage);
    } catch (err) {
      console.error(`\n✗ ${caso.etichetta} — ERRORE:`, err instanceof Error ? err.message : err);
    }
    if (i < casi.length - 1) await new Promise((r) => setTimeout(r, PAUSA_MS));
  }

  // Riepilogo
  const linea = "═".repeat(72);
  console.log(`\n${linea}\nRIEPILOGO\n${linea}`);
  console.log("Caso".padEnd(46) + "Score".padEnd(8) + "Categoria");
  for (const { caso, r } of risultati) {
    console.log(caso.etichetta.slice(0, 44).padEnd(46) + String(r.score).padEnd(8) + r.categoria);
  }

  if (risultati.length > 0) {
    const totIn = risultati.reduce((s, x) => s + x.usage.input_tokens, 0);
    const totOut = risultati.reduce((s, x) => s + x.usage.output_tokens, 0);
    const totCosto = risultati.reduce((s, x) => s + x.usage.costo_usd, 0);
    const medio = totCosto / risultati.length;
    console.log(`\nToken totali: in=${totIn} out=${totOut}`);
    console.log(`Costo totale: $${totCosto.toFixed(4)} — costo medio per lead: $${medio.toFixed(4)} (~€${(medio * 0.93).toFixed(4)})`);
    console.log(`Stima per 1.000 lead/mese: ~$${(medio * 1000).toFixed(2)}`);
  }
}

main();
