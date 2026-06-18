import type { Categoria, Stato } from "../../lib/types";

/** Lead demo pre-qualificato (nessuna chiamata API necessaria per il seed). */
export interface SeedLead {
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
  stato: Stato;
  giorniFa: number;
  ora: string;
}
