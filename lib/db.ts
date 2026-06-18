import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import type { Lead, Stato } from "./types";

/**
 * Accesso al database tramite libSQL.
 * - In locale: file SQLite (`file:./data/leadpilot.db`), nessuna config.
 * - In produzione (es. Vercel): Turso, impostando TURSO_DATABASE_URL +
 *   TURSO_AUTH_TOKEN. Lo stesso codice funziona in entrambi i casi.
 */
const LOCAL_URL = "file:./data/leadpilot.db";

let client: Client | null = null;
let ready: Promise<Client> | null = null;

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL || LOCAL_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Per un file locale assicuriamo che la cartella esista (Turso remoto no).
  if (url.startsWith("file:")) {
    const dir = path.dirname(url.replace(/^file:/, ""));
    if (dir) fs.mkdirSync(dir, { recursive: true });
  }

  // intMode "number" evita che le colonne INTEGER tornino come BigInt
  // (che non sarebbero serializzabili in JSON nelle risposte API).
  return createClient({ url, authToken, intMode: "number" });
}

/** Restituisce il client inizializzato (crea le tabelle alla prima chiamata). */
async function getDb(): Promise<Client> {
  if (!ready) {
    client = createDbClient();
    const c = client;
    ready = c
      .batch(
        [
          `CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            telefono TEXT,
            messaggio TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 0,
            categoria TEXT NOT NULL DEFAULT 'freddo',
            esigenza TEXT NOT NULL DEFAULT '',
            budget TEXT,
            urgenza TEXT NOT NULL DEFAULT 'non indicata',
            bozza_email TEXT NOT NULL DEFAULT '',
            slot_proposti TEXT NOT NULL DEFAULT '[]',
            stato TEXT NOT NULL DEFAULT 'nuovo',
            tempo_risposta_ms INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
          )`,
          `CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contenuto TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
          )`,
        ],
        "write"
      )
      .then(() => c);
  }
  return ready;
}

export type NuovoLead = Omit<Lead, "id" | "created_at" | "stato"> & {
  stato?: Stato;
  created_at?: string | null;
};

export async function insertLead(lead: NuovoLead): Promise<Lead> {
  const d = await getDb();
  const res = await d.execute({
    sql: `INSERT INTO leads
      (nome, email, telefono, messaggio, score, categoria, esigenza, budget,
       urgenza, bozza_email, slot_proposti, stato, tempo_risposta_ms, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))`,
    args: [
      lead.nome,
      lead.email,
      lead.telefono,
      lead.messaggio,
      lead.score,
      lead.categoria,
      lead.esigenza,
      lead.budget,
      lead.urgenza,
      lead.bozza_email,
      lead.slot_proposti,
      lead.stato ?? "nuovo",
      lead.tempo_risposta_ms,
      lead.created_at ?? null,
    ],
  });
  const lead_ = await getLead(Number(res.lastInsertRowid));
  return lead_!;
}

export async function getLead(id: number): Promise<Lead | undefined> {
  const d = await getDb();
  const res = await d.execute({ sql: "SELECT * FROM leads WHERE id = ?", args: [id] });
  return res.rows[0] as unknown as Lead | undefined;
}

export async function listLeads(): Promise<Lead[]> {
  const d = await getDb();
  const res = await d.execute("SELECT * FROM leads ORDER BY created_at DESC, id DESC");
  return res.rows as unknown as Lead[];
}

export async function updateLeadStato(id: number, stato: Stato): Promise<Lead | undefined> {
  const d = await getDb();
  await d.execute({ sql: "UPDATE leads SET stato = ? WHERE id = ?", args: [stato, id] });
  return getLead(id);
}

export async function saveReport(contenuto: string): Promise<void> {
  const d = await getDb();
  await d.execute({ sql: "INSERT INTO reports (contenuto) VALUES (?)", args: [contenuto] });
}

export async function getLastReport(): Promise<{ contenuto: string; created_at: string } | undefined> {
  const d = await getDb();
  const res = await d.execute("SELECT contenuto, created_at FROM reports ORDER BY id DESC LIMIT 1");
  return res.rows[0] as unknown as { contenuto: string; created_at: string } | undefined;
}

/** Svuota le tabelle (usato dal seed / demo:reset). */
export async function resetAll(): Promise<number> {
  const d = await getDb();
  const before = await d.execute("SELECT COUNT(*) AS n FROM leads");
  await d.batch(["DELETE FROM leads", "DELETE FROM reports"], "write");
  return Number(before.rows[0].n);
}
