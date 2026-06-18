import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { Lead, Stato } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "leadpilot.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
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
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contenuto TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

export type NuovoLead = Omit<Lead, "id" | "created_at" | "stato"> & {
  stato?: Stato;
  created_at?: string;
};

export function insertLead(lead: NuovoLead): Lead {
  const d = getDb();
  const stmt = d.prepare(`
    INSERT INTO leads
      (nome, email, telefono, messaggio, score, categoria, esigenza, budget,
       urgenza, bozza_email, slot_proposti, stato, tempo_risposta_ms, created_at)
    VALUES
      (@nome, @email, @telefono, @messaggio, @score, @categoria, @esigenza, @budget,
       @urgenza, @bozza_email, @slot_proposti, @stato, @tempo_risposta_ms,
       COALESCE(@created_at, datetime('now')))
  `);
  const info = stmt.run({
    stato: "nuovo",
    created_at: null,
    ...lead,
  });
  return getLead(Number(info.lastInsertRowid))!;
}

export function getLead(id: number): Lead | undefined {
  return getDb()
    .prepare("SELECT * FROM leads WHERE id = ?")
    .get(id) as Lead | undefined;
}

export function listLeads(): Lead[] {
  return getDb()
    .prepare("SELECT * FROM leads ORDER BY created_at DESC, id DESC")
    .all() as Lead[];
}

export function updateLeadStato(id: number, stato: Stato): Lead | undefined {
  getDb().prepare("UPDATE leads SET stato = ? WHERE id = ?").run(stato, id);
  return getLead(id);
}

export function saveReport(contenuto: string): void {
  getDb().prepare("INSERT INTO reports (contenuto) VALUES (?)").run(contenuto);
}

export function getLastReport(): { contenuto: string; created_at: string } | undefined {
  return getDb()
    .prepare("SELECT contenuto, created_at FROM reports ORDER BY id DESC LIMIT 1")
    .get() as { contenuto: string; created_at: string } | undefined;
}
