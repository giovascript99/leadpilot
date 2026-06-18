import type { BusinessConfig } from "../types";

/** Preset demo: agenzia immobiliare (target prioritario outreach). */
export const immobiliare: BusinessConfig = {
  nomeAzienda: "Visconti Immobiliare",
  settore: "Agenzia immobiliare — compravendita residenziale",
  logoTestuale: "VI",
  colorePrimario: "#1e3a8a",
  descrizioneServizi:
    "Compravendita residenziale a Milano: valutazioni accurate basate sui dati reali di " +
    "zona, acquirenti selezionati e qualificati, gestione completa di trattativa e " +
    "documenti fino al rogito. Tempo medio di vendita: 60 giorni.",
  criteriQualificazione: {
    budgetMinimo: "150.000 € (valore immobile o budget di acquisto)",
    zonaOperativa: "Milano città e prima cintura (Sesto, Cologno, San Donato, Buccinasco)",
    tipiRichiestaIdeali: [
      "Incarico di vendita di immobile residenziale",
      "Acquisto con budget definito o mutuo pre-approvato",
      "Investimento residenziale da mettere a reddito",
    ],
    note:
      "Affitti (in particolare stanze e brevi periodi) e immobili fuori zona sono fuori " +
      "target. Richieste di sola valutazione senza intenzione di vendita: priorità bassa. " +
      "Priorità alta a proprietari con tempistiche definite e acquirenti con mutuo già istruito.",
  },
  tonoRisposte: "formale",
  esempioRichiesta:
    "Es. Vorrei vendere il mio trilocale di 90 mq in zona Città Studi, valutazioni " +
    "intorno ai 450.000 €, possibilmente entro l'autunno…",
};
