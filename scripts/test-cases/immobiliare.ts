import type { CasoTest } from "./tipi";

/** 8 casi di collaudo per il preset IMMOBILIARE. */
export const casiImmobiliare: CasoTest[] = [
  {
    etichetta: "1. CALDO — vende e ricompra, urgenza",
    atteso: "caldo, score alto",
    nome: "Silvia Marchetti",
    email: "silvia.marchetti@gmail.com",
    telefono: "+39 340 7788990",
    messaggio:
      "Buongiorno, vorrei vendere il mio bilocale in zona Porta Venezia (65 mq, secondo piano, ristrutturato nel 2021) per comprare un trilocale sempre in zona. Le valutazioni online dicono circa 390.000 €. Ho già parlato con la banca per il mutuo integrativo. Vorrei concludere entro fine anno, possiamo fissare una valutazione?",
  },
  {
    etichetta: "2. CALDO ma sgrammaticato",
    atteso: "caldo nonostante la forma",
    nome: "rosario c.",
    email: "rosariocal62@libero.it",
    messaggio:
      "salve devo vendere apartamento di mia madre che e andata in rsa, sta in zona giambellino 3 locali, serve vendere presto per pagare la retta, quanto vale secondo voi?? potete venire a vedere",
  },
  {
    etichetta: "3. VAGA — vorrei informazioni",
    atteso: "freddo/tiepido basso, UNA domanda",
    nome: "Daniele F.",
    email: "daniele.f@hotmail.it",
    messaggio: "Vorrei informazioni.",
  },
  {
    etichetta: "4. FUORI TARGET — affitto + fuori zona",
    atteso: "freddo, declino cortese",
    nome: "Greta Olivieri",
    email: "greta.olivieri@gmail.com",
    messaggio:
      "Ciao, cerco una casa vacanze in affitto per agosto in Liguria, zona Sestri Levante, max 1.500 € per due settimane. Trattate anche queste cose?",
  },
  {
    etichetta: "5. SPAM evidente",
    atteso: "spam, score ~0, NESSUNA bozza",
    nome: "Lead Boost Agency",
    email: "sales@leadboost.agency",
    messaggio:
      "AGENTI IMMOBILIARI: vi portiamo 50 venditori MOTIVATI al mese con il nostro sistema di lead generation! Prova gratuita 7 giorni, poi solo 297€/mese. Prenota una demo su leadboost.agency/immobiliare!!!",
  },
  {
    etichetta: "6. LEAD IN INGLESE",
    atteso: "caldo, risposta in inglese",
    nome: "Sarah Mitchell",
    email: "sarah.mitchell@gmail.com",
    telefono: "+1 415 555 0188",
    messaggio:
      "Hello, I'm relocating back to the US and need to sell my 2-bedroom apartment in Brera (95 sqm, renovated, 4th floor with elevator). Recent appraisals suggest around €750,000. I need the sale completed by March. Do you handle everything including paperwork for foreign sellers?",
  },
  {
    etichetta: "7. LUNGHISSIMO e dispersivo",
    atteso: "estrazione corretta dei dati sepolti",
    nome: "Carla Vismara",
    email: "carla.vismara55@gmail.com",
    messaggio:
      "Buongiorno, scrivo un po' per sfogarmi e un po' per chiedere. Dunque, casa nostra è un quadrilocale a Cologno Monzese, zona metro verde, comprato nel 1998 quando ci siamo sposati. Adesso i figli sono grandi, una è andata a vivere a Bologna e l'altro si trasferisce a breve, e noi due in 130 mq non sappiamo più che farci, paghiamo un sacco di spese condominiali (380 al mese, capito?) e il riscaldamento centralizzato è una rovina. Mia sorella dice di affittarlo ma io non voglio pensieri, gli inquilini poi non pagano e chi li manda via. Quindi pensavamo di vendere e prendere un bilocale più vicino al centro, magari zona Lambrate che c'è la metro, o anche restare a Cologno ma in una casa nuova classe A che consumi meno. Il geometra amico di mio marito dice che il nostro vale sui 320-340 mila. Non abbiamo fretta fretta, però se troviamo la casa giusta vorremmo muoverci entro la primavera. Voi come lavorate? Fate vedere le case anche il sabato?",
  },
  {
    etichetta: "8. SOLO 4 PAROLE",
    atteso: "tiepido/freddo, UNA domanda",
    nome: "Omar B.",
    email: "omar.b.mi@gmail.com",
    messaggio: "quanto vale casa mia",
  },
];
