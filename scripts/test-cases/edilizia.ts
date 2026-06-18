import type { CasoTest } from "./tipi";

/** 8 casi di collaudo per il preset EDILIZIA. */
export const casiEdilizia: CasoTest[] = [
  {
    etichetta: "1. CALDO — budget esplicito e urgenza",
    atteso: "caldo, score alto",
    nome: "Andrea Colombo",
    email: "andrea.colombo@gmail.com",
    telefono: "+39 335 1112233",
    messaggio:
      "Buongiorno, devo ristrutturare completamente un appartamento di 100 mq in zona Porta Romana a Milano. Budget 55.000 €, l'immobile è libero e vorrei iniziare i lavori a luglio. Potete fare un sopralluogo questa settimana?",
  },
  {
    etichetta: "2. CALDO ma sgrammaticato",
    atteso: "caldo nonostante la forma",
    nome: "giuseppe r.",
    email: "peppe.r1965@libero.it",
    messaggio:
      "salve volio rifare bagnio e anche cucina apartamento mio a milano sud, o da parte 30mila euro, qando potete venire a vedere?? grazzie",
  },
  {
    etichetta: "3. VAGA — vorrei informazioni",
    atteso: "freddo/tiepido basso, email con UNA domanda",
    nome: "Paola M.",
    email: "paola.m@hotmail.it",
    messaggio: "Vorrei informazioni sui vostri servizi.",
  },
  {
    etichetta: "4. FUORI TARGET — zona + tipo intervento",
    atteso: "freddo, declino cortese",
    nome: "Franco Esposito",
    email: "franco.esp@gmail.com",
    messaggio:
      "Buonasera, abito a Como e dovrei solo imbiancare il soggiorno e una camera, circa 35 mq. Quanto mi costerebbe?",
  },
  {
    etichetta: "5. SPAM evidente",
    atteso: "spam, score ~0, NESSUNA bozza",
    nome: "SEO Master Pro",
    email: "promo@seo-boost.xyz",
    messaggio:
      "Vuoi portare il tuo sito in PRIMA PAGINA su Google? Offerta speciale solo oggi: pacchetto SEO + 1000 backlink a soli 99€! Rispondi subito o visita www.seo-boost.xyz!!!",
  },
  {
    etichetta: "6. LEAD IN INGLESE",
    atteso: "caldo, risposta in inglese",
    nome: "James Whitfield",
    email: "j.whitfield@protonmail.com",
    telefono: "+44 7700 900123",
    messaggio:
      "Hi, I've just bought an 80 sqm flat in Milan (Isola district) that needs a full renovation. My budget is around €50,000 and I'd like the works done by November. Do you work with English-speaking clients?",
  },
  {
    etichetta: "7. LUNGHISSIMO e dispersivo",
    atteso: "estrazione corretta dei dati sepolti",
    nome: "Mariangela Fumagalli",
    email: "mariangela.fuma@gmail.com",
    messaggio:
      "Buongiorno, allora, premetto che non so bene da dove cominciare perché è la prima volta che faccio una cosa del genere. Casa era dei miei suoceri, una casa vecchia, di quelle con i pavimenti in graniglia che adesso vanno pure di moda mi dicono, ma insomma noi non sappiamo se tenerli o no. Mio marito dice di tenerli, io invece li toglierei. Comunque, la casa è a Cologno Monzese, sono circa 85 metri quadri, terzo piano con ascensore per fortuna perché con i materiali sennò era un problema. I bagni sono due ma uno è cieco e puzza sempre di umido, quello lo rifarei di sicuro. La cucina è del 1987 quindi anche quella va cambiata, e poi tutto l'impianto elettrico che ancora non ha il salvavita, ci pensate? Mia cognata ha ristrutturato l'anno scorso e ha speso 48.000 euro però casa sua è più grande. Noi pensavamo di stare sui 40.000, massimo 45.000 se proprio serve. Ah dimenticavo, vorremmo fare i lavori entro l'autunno perché a dicembre arriva il secondo bambino e vorremmo essere dentro per Natale. Mi dite come funziona con voi? Fate tutto voi o dobbiamo chiamare noi l'architetto?",
  },
  {
    etichetta: "8. SOLO 4 PAROLE",
    atteso: "tiepido/freddo, email con domanda di chiarimento",
    nome: "Luca B.",
    email: "lucab.smart@gmail.com",
    messaggio: "preventivo bagno quanto costa",
  },
];
