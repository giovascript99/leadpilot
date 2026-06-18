export type Categoria = "caldo" | "tiepido" | "freddo" | "spam";
export type Stato = "nuovo" | "risposto" | "appuntamento";

export interface SlotAppuntamento {
  giorno: string; // es. "lunedì 15 giugno"
  ora: string; // es. "10:00"
}

export interface Lead {
  id: number;
  nome: string;
  email: string;
  telefono: string | null;
  messaggio: string;
  score: number;
  categoria: Categoria;
  esigenza: string;
  budget: string | null;
  urgenza: string;
  bozza_email: string;
  slot_proposti: string; // JSON di SlotAppuntamento[]
  stato: Stato;
  tempo_risposta_ms: number;
  created_at: string;
}

export interface QualificationResult {
  score: number;
  categoria: Categoria;
  esigenza: string;
  budget: string | null;
  urgenza: string;
  bozza_email: string;
  slot_proposti: SlotAppuntamento[];
}
