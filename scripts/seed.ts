/**
 * Seed / demo:reset — svuota il DB (lead + report) e lo ripopola con 12 lead
 * realistici già qualificati, nel SETTORE del preset attivo in
 * config/business.ts. Nessuna chiamata API necessaria.
 *
 * Uso: npm run seed  (alias: npm run demo:reset)
 */
import { getDb, insertLead } from "../lib/db";
import { prossimiGiorniLavorativi } from "../lib/ai";
import { businessConfig } from "../config/business";
import { leadsEdilizia } from "./seed-data/edilizia";
import { leadsImmobiliare } from "./seed-data/immobiliare";

function giorniFa(n: number, ora: string): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.toISOString().slice(0, 10)} ${ora}`;
}

// Dataset coerente col preset attivo: si seleziona dal settore configurato.
const leads = /immobiliar/i.test(businessConfig.settore)
  ? leadsImmobiliare
  : leadsEdilizia;
const settore = /immobiliar/i.test(businessConfig.settore) ? "immobiliare" : "edilizia";

const slots = JSON.stringify(prossimiGiorniLavorativi(3));

function main() {
  const db = getDb();
  const count = (db.prepare("SELECT COUNT(*) AS n FROM leads").get() as { n: number }).n;
  if (count > 0) {
    console.log(`Il database contiene già ${count} lead. Svuoto e ricreo i dati demo…`);
  }
  db.prepare("DELETE FROM leads").run();
  db.prepare("DELETE FROM reports").run();

  for (const l of leads) {
    insertLead({
      nome: l.nome,
      email: l.email,
      telefono: l.telefono,
      messaggio: l.messaggio,
      score: l.score,
      categoria: l.categoria,
      esigenza: l.esigenza,
      budget: l.budget,
      urgenza: l.urgenza,
      bozza_email: l.bozza_email,
      slot_proposti: l.categoria === "spam" ? "[]" : slots,
      stato: l.stato,
      tempo_risposta_ms: 1500 + Math.floor(Math.random() * 4000),
      created_at: giorniFa(l.giorniFa, l.ora),
    });
  }

  console.log(`✓ Inseriti ${leads.length} lead demo (settore: ${settore}, brand: ${businessConfig.nomeAzienda}).`);
  console.log("  Avvia l'app con `npm run dev` e apri http://localhost:3000/dashboard");
}

main();
