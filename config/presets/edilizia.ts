import type { BusinessConfig } from "../types";

/** Preset demo: impresa di ristrutturazioni (settore edilizia). */
export const edilizia: BusinessConfig = {
  nomeAzienda: "Ristrutturazioni Rossi",
  settore: "Edilizia e ristrutturazioni residenziali",
  logoTestuale: "RB",
  colorePrimario: "#0d6e5f",
  descrizioneServizi:
    "Ristrutturazioni complete di appartamenti e ville, rifacimento bagni e cucine, " +
    "cappotti termici e riqualificazione energetica. Operiamo da oltre 20 anni con " +
    "squadre proprie, preventivi chiari e tempi certi.",
  criteriQualificazione: {
    budgetMinimo: "15.000 €",
    zonaOperativa: "Milano e provincia (max 40 km dal centro)",
    tipiRichiestaIdeali: [
      "Ristrutturazione completa appartamento",
      "Rifacimento bagno o cucina",
      "Cappotto termico / efficientamento energetico",
    ],
    note:
      "Richieste fuori zona o per soli piccoli interventi (tinteggiatura singola stanza, " +
      "riparazioni minori) sono fuori target. Priorità a chi indica tempistiche definite.",
  },
  tonoRisposte: "formale",
  esempioRichiesta:
    "Es. Vorrei ristrutturare un appartamento di 90 mq in zona Navigli, budget " +
    "indicativo 40.000 €, lavori da iniziare entro settembre…",
};
