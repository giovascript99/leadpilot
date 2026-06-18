/**
 * Tipo della configurazione prospect. I preset (config/presets/*) implementano
 * questa interfaccia; config/business.ts esporta il preset attivo.
 */
export interface BusinessConfig {
  /** Nome dell'azienda mostrato ovunque nell'app */
  nomeAzienda: string;
  /** Settore di attività (usato anche nel prompt di qualificazione) */
  settore: string;
  /** Logo testuale: sigla o emoji mostrata nel badge del brand */
  logoTestuale: string;
  /** Colore primario del brand (hex) — applica branding a tutta l'app */
  colorePrimario: string;
  /** Descrizione dei servizi offerti (usata nel form e nel prompt AI) */
  descrizioneServizi: string;
  /** Criteri di qualificazione: l'AI valuta ogni lead rispetto a questi */
  criteriQualificazione: {
    budgetMinimo: string;
    zonaOperativa: string;
    tipiRichiestaIdeali: string[];
    note: string;
  };
  /** Tono delle risposte generate dall'AI */
  tonoRisposte: "formale" | "informale";
  /** Esempio di richiesta mostrato come placeholder nel form pubblico */
  esempioRichiesta: string;
}
