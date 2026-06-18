import { describe, it, expect } from "vitest";
import {
  parseJsonDifensivo,
  normalizzaRisultato,
  prossimiGiorniLavorativi,
} from "./ai";

describe("parseJsonDifensivo", () => {
  it("estrae JSON pulito", () => {
    expect(parseJsonDifensivo('{"score": 80}')).toEqual({ score: 80 });
  });

  it("rimuove i code fence ```json", () => {
    const input = '```json\n{"score": 50, "categoria": "tiepido"}\n```';
    expect(parseJsonDifensivo(input)).toEqual({ score: 50, categoria: "tiepido" });
  });

  it("estrae l'oggetto JSON anche con testo attorno", () => {
    const input = 'Ecco la risposta:\n{"score": 90}\nSpero sia utile.';
    expect(parseJsonDifensivo(input)).toEqual({ score: 90 });
  });

  it("lancia un errore se non c'è JSON", () => {
    expect(() => parseJsonDifensivo("nessun json qui")).toThrow();
  });
});

describe("normalizzaRisultato", () => {
  it("clampa lo score sopra 100 e sotto 0", () => {
    expect(normalizzaRisultato({ score: 150, categoria: "caldo" }).score).toBe(100);
    expect(normalizzaRisultato({ score: -20, categoria: "freddo" }).score).toBe(0);
  });

  it("usa score 0 se non è un numero valido", () => {
    expect(normalizzaRisultato({ score: "abc", categoria: "freddo" }).score).toBe(0);
  });

  it("deriva la categoria dallo score se è invalida", () => {
    expect(normalizzaRisultato({ score: 80, categoria: "boh" }).categoria).toBe("caldo");
    expect(normalizzaRisultato({ score: 50, categoria: "" }).categoria).toBe("tiepido");
    expect(normalizzaRisultato({ score: 10, categoria: undefined }).categoria).toBe("freddo");
  });

  it("forza bozza vuota e nessuno slot per lo spam", () => {
    const r = normalizzaRisultato({
      score: 5,
      categoria: "spam",
      bozza_email: "Gentile cliente, la ringraziamo...",
      slot_proposti: [{ giorno: "lunedì", ora: "10:00" }],
    });
    expect(r.bozza_email).toBe("");
    expect(r.slot_proposti).toEqual([]);
    expect(r.budget).toBeNull();
  });

  it("normalizza budget vuoto a null", () => {
    expect(normalizzaRisultato({ score: 60, categoria: "tiepido", budget: "" }).budget).toBeNull();
    expect(normalizzaRisultato({ score: 60, categoria: "tiepido", budget: "  " }).budget).toBeNull();
    expect(normalizzaRisultato({ score: 90, categoria: "caldo", budget: "50.000 €" }).budget).toBe(
      "50.000 €"
    );
  });

  it("usa slot di riserva quando il modello ne fornisce meno di 3", () => {
    const r = normalizzaRisultato({
      score: 90,
      categoria: "caldo",
      slot_proposti: [{ giorno: "lunedì", ora: "10:00" }],
    });
    expect(r.slot_proposti).toHaveLength(3);
  });
});

describe("prossimiGiorniLavorativi", () => {
  it("restituisce esattamente N slot", () => {
    expect(prossimiGiorniLavorativi(3)).toHaveLength(3);
    expect(prossimiGiorniLavorativi(5)).toHaveLength(5);
  });

  it("non propone mai sabato o domenica", () => {
    for (const slot of prossimiGiorniLavorativi(10)) {
      expect(slot.giorno).not.toMatch(/^(sabato|domenica)/);
    }
  });

  it("ogni slot ha giorno e ora non vuoti", () => {
    for (const slot of prossimiGiorniLavorativi(3)) {
      expect(slot.giorno.length).toBeGreaterThan(0);
      expect(slot.ora).toMatch(/^\d{2}:\d{2}$/);
    }
  });
});
