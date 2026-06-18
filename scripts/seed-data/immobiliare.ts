import type { SeedLead } from "./types";

/**
 * 12 lead demo per il preset IMMOBILIARE (Visconti Immobiliare).
 * Mix realistico: incarichi di vendita, acquirenti qualificati, valutazioni
 * esplorative, fuori zona, affitti fuori target, uno spam.
 */
export const leadsImmobiliare: SeedLead[] = [
  {
    nome: "Stefano Marini",
    email: "stefano.marini@gmail.com",
    telefono: "+39 338 2233445",
    messaggio:
      "Buongiorno, devo vendere un trilocale di 85 mq in zona Isola, terzo piano con balcone. Mi trasferisco a Torino per lavoro entro ottobre quindi ho una certa urgenza. Ho già fatto fare due valutazioni (sui 420.000 €) ma cerco un'agenzia che lo venda davvero, non che lo parcheggi. Possiamo sentirci?",
    score: 95,
    categoria: "caldo",
    esigenza: "Incarico di vendita trilocale 85 mq zona Isola, urgenza per trasferimento entro ottobre",
    budget: "420.000 € (valore stimato)",
    urgenza: "alta",
    bozza_email:
      "Gentile Sig. Marini,\n\nla ringraziamo per averci contattato. Un trilocale con balcone in zona Isola è un immobile con domanda molto sostenuta: con un incarico ben impostato, la tempistica di ottobre è pienamente compatibile con il nostro tempo medio di vendita di 60 giorni.\n\nLe proponiamo un sopralluogo per una valutazione basata sui dati reali di zona e per illustrarle il nostro metodo di vendita:\n• giovedì ore 10:00\n• venerdì ore 15:00\n• lunedì ore 11:30\n\nIn attesa di un Suo riscontro, porgiamo cordiali saluti.\n\nVisconti Immobiliare",
    stato: "appuntamento",
    giorniFa: 6,
    ora: "09:32:00",
  },
  {
    nome: "Claudia Ferretti",
    email: "claudia.ferretti@outlook.it",
    telefono: "+39 347 5566778",
    messaggio:
      "Salve, io e mio marito cerchiamo un bilocale in zona Navigli o Tortona, abbiamo un mutuo pre-approvato da 350.000 €. Vorremmo chiudere entro fine anno. Avete qualcosa in portafoglio?",
    score: 91,
    categoria: "caldo",
    esigenza: "Acquisto bilocale zona Navigli/Tortona con mutuo pre-approvato, chiusura entro fine anno",
    budget: "350.000 €",
    urgenza: "alta",
    bozza_email:
      "Gentile Sig.ra Ferretti,\n\ngrazie per averci contattato. Un mutuo pre-approvato da 350.000 € vi rende acquirenti molto competitivi nelle zone che indicate: possiamo proporvi gli immobili in portafoglio compatibili e attivare una ricerca dedicata.\n\nVi proponiamo un incontro in agenzia o una chiamata:\n• giovedì ore 10:00\n• venerdì ore 15:00\n• lunedì ore 11:30\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "risposto",
    giorniFa: 6,
    ora: "17:05:00",
  },
  {
    nome: "Giorgio Albanese",
    email: "g.albanese@pec-mail.it",
    telefono: "+39 335 9900112",
    messaggio:
      "Buonasera, vendo villetta a schiera a San Donato Milanese, 140 mq con giardino, per acquisto casa più grande. Vorrei capire valore di mercato attuale e tempi realistici. Disponibile anche subito per un sopralluogo.",
    score: 93,
    categoria: "caldo",
    esigenza: "Incarico di vendita villetta a schiera 140 mq a San Donato, disponibilità immediata al sopralluogo",
    budget: null,
    urgenza: "alta",
    bozza_email:
      "Gentile Sig. Albanese,\n\nla ringraziamo per la Sua richiesta. San Donato rientra pienamente nella nostra zona operativa e le villette con giardino hanno oggi una domanda molto attiva.\n\nVista la Sua disponibilità immediata, le proponiamo il sopralluogo per la valutazione:\n• giovedì ore 10:00\n• venerdì ore 15:00\n• lunedì ore 11:30\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "nuovo",
    giorniFa: 5,
    ora: "20:14:00",
  },
  {
    nome: "Martina Colombo",
    email: "marti.colombo89@gmail.com",
    telefono: null,
    messaggio:
      "Ciao, volevo solo sapere indicativamente quanto vale un bilocale in zona Lambrate, 55 mq, anni '60 ristrutturato. Non ho ancora deciso se vendere, dipende dal prezzo.",
    score: 52,
    categoria: "tiepido",
    esigenza: "Valutazione esplorativa bilocale 55 mq zona Lambrate, intenzione di vendita non definita",
    budget: null,
    urgenza: "bassa",
    bozza_email:
      "Gentile Sig.ra Colombo,\n\ngrazie per averci scritto. Per darle un valore affidabile — e non una stima generica — ci serve vedere l'immobile: la valutazione in zona Lambrate varia sensibilmente per piano, esposizione e qualità della ristrutturazione.\n\nLa valutazione è gratuita e senza impegno: preferisce un sopralluogo in settimana?\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "risposto",
    giorniFa: 5,
    ora: "12:40:00",
  },
  {
    nome: "Alessandro Banfi",
    email: "ale.banfi@yahoo.it",
    telefono: "+39 340 1122334",
    messaggio:
      "Buongiorno, più avanti vorremmo comprare casa, forse l'anno prossimo, ancora non sappiamo bene la zona né il budget. Intanto volevo capire come funziona con voi.",
    score: 45,
    categoria: "tiepido",
    esigenza: "Interesse all'acquisto in fase preliminare, senza zona, budget né tempistiche definite",
    budget: null,
    urgenza: "bassa",
    bozza_email:
      "Gentile Sig. Banfi,\n\ngrazie per averci contattato. Per orientarla al meglio, le chiediamo una sola cosa: ha già un'idea della disponibilità di spesa, anche indicativa? Da lì possiamo suggerirle zone e tagli realistici e tenerla aggiornata sulle occasioni giuste.\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "nuovo",
    giorniFa: 4,
    ora: "10:55:00",
  },
  {
    nome: "Riccardo Sala",
    email: "r.sala@salaholding.it",
    telefono: "+39 02 8899001",
    messaggio:
      "Buongiorno, gestisco un piccolo patrimonio familiare e cerco 2-3 bilocali da mettere a reddito a Milano, zone con buona domanda di affitto (Città Studi, Bicocca). Budget complessivo 500.000 €. Mi interessa anche la gestione della messa a reddito se la fate.",
    score: 92,
    categoria: "caldo",
    esigenza: "Investimento: acquisto 2-3 bilocali da mettere a reddito in zone universitarie, budget 500.000 €",
    budget: "500.000 €",
    urgenza: "media",
    bozza_email:
      "Gentile Sig. Sala,\n\nla ringraziamo per la Sua richiesta. Città Studi e Bicocca sono tra le zone a maggiore domanda locativa di Milano e il budget indicato consente di costruire un portafoglio di 2-3 unità ben posizionate.\n\nLe proponiamo un incontro per presentarle le opportunità attualmente in portafoglio:\n• giovedì ore 10:00\n• venerdì ore 15:00\n• lunedì ore 11:30\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "appuntamento",
    giorniFa: 4,
    ora: "15:21:00",
  },
  {
    nome: "Yasmin El Amrani",
    email: "yasmin.studentessa@gmail.com",
    telefono: null,
    messaggio:
      "Ciao! Cerco una stanza singola in affitto vicino al Politecnico per settembre, budget max 650 € al mese. Avete qualcosa?",
    score: 18,
    categoria: "freddo",
    esigenza: "Ricerca stanza in affitto per studente — fuori target (non trattiamo affitti)",
    budget: "650 €/mese",
    urgenza: "media",
    bozza_email:
      "Gentile Yasmin,\n\ngrazie per averci scritto. La nostra agenzia si occupa esclusivamente di compravendita residenziale e non gestiamo affitti di stanze: per la sua ricerca le consigliamo i portali specializzati in alloggi per studenti.\n\nIn bocca al lupo per la ricerca!\n\nVisconti Immobiliare",
    stato: "risposto",
    giorniFa: 3,
    ora: "11:08:00",
  },
  {
    nome: "Vito Lorusso",
    email: "vito.lorusso58@libero.it",
    telefono: "+39 368 7788990",
    messaggio:
      "Salve, avrei un appartamento a Bari vecchia da vendere, 95 mq da ristrutturare. Voi lo trattate? Eventualmente quanto chiedete di commissione?",
    score: 25,
    categoria: "freddo",
    esigenza: "Vendita appartamento a Bari — fuori zona operativa",
    budget: null,
    urgenza: "non indicata",
    bozza_email:
      "Gentile Sig. Lorusso,\n\nla ringraziamo per la fiducia. Operiamo però esclusivamente su Milano e prima cintura: su Bari non saremmo in grado di garantirle il livello di servizio e di conoscenza del mercato locale che un immobile merita.\n\nLe consigliamo un'agenzia radicata nella zona di Bari vecchia.\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "risposto",
    giorniFa: 3,
    ora: "16:47:00",
  },
  {
    nome: "Foto Immobili Pro",
    email: "info@fotoimmobilipro.click",
    telefono: null,
    messaggio:
      "AGENZIE IMMOBILIARI: i vostri annunci non vendono perché le FOTO sono brutte! Pacchetto servizio fotografico + virtual tour a soli 149€ ad immobile. Sconto 30% se rispondete entro 48 ore! www.fotoimmobilipro.click",
    score: 3,
    categoria: "spam",
    esigenza: "Promozione commerciale di servizi fotografici (spam)",
    budget: null,
    urgenza: "non indicata",
    bozza_email: "",
    stato: "nuovo",
    giorniFa: 2,
    ora: "04:12:00",
  },
  {
    nome: "Lucia e Andrea Pellegrini",
    email: "famiglia.pellegrini.mi@gmail.com",
    telefono: "+39 333 4455112",
    messaggio:
      "Buongiorno, con mio fratello abbiamo ereditato l'appartamento dei nostri genitori in zona Precotto, 110 mq. Lui vorrebbe vendere subito, io non sono convinta, e non sappiamo neanche da dove si comincia con la successione già fatta. Ci potete aiutare a capire?",
    score: 58,
    categoria: "tiepido",
    esigenza: "Immobile ereditato 110 mq a Precotto, da chiarire accordo tra eredi e percorso di vendita",
    budget: null,
    urgenza: "bassa",
    bozza_email:
      "Gentili Sigg. Pellegrini,\n\ngrazie per averci scritto. Situazioni come la vostra sono frequenti: il primo passo utile è una valutazione oggettiva dell'immobile, che dà a entrambi una base concreta per decidere con serenità.\n\nLa valutazione è gratuita e non vi impegna alla vendita: vi andrebbe bene un sopralluogo in settimana?\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "nuovo",
    giorniFa: 2,
    ora: "19:36:00",
  },
  {
    nome: "Paola Brambilla",
    email: "paola.brambilla@gmail.com",
    telefono: "+39 339 6677889",
    messaggio:
      "Buongiorno, vendiamo il nostro bilocale in zona De Angeli (60 mq, ottimo stato) per comprare un trilocale nella stessa zona, dato che aspettiamo il secondo figlio. Budget per l'acquisto fino a 520.000 € col ricavato della vendita più mutuo già deliberato. Tempistica: entro la primavera prossima. Gestite anche operazioni doppie vendita+acquisto?",
    score: 96,
    categoria: "caldo",
    esigenza: "Operazione doppia: vendita bilocale 60 mq e acquisto trilocale zona De Angeli, mutuo deliberato",
    budget: "520.000 € (acquisto)",
    urgenza: "alta",
    bozza_email:
      "Gentile Sig.ra Brambilla,\n\ngrazie per averci contattato. Le operazioni combinate vendita+acquisto sono la nostra specialità: gestirle con un unico interlocutore consente di sincronizzare i tempi ed evitare il rischio di restare senza casa tra le due operazioni.\n\nCon un bilocale in ottimo stato a De Angeli e il mutuo già deliberato, la tempistica di primavera è realistica. Le proponiamo un sopralluogo:\n• giovedì ore 10:00\n• venerdì ore 15:00\n• lunedì ore 11:30\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "nuovo",
    giorniFa: 1,
    ora: "09:18:00",
  },
  {
    nome: "Mauro T.",
    email: "mauro.t.1971@hotmail.com",
    telefono: null,
    messaggio: "info case zona sud milano",
    score: 32,
    categoria: "freddo",
    esigenza: "Richiesta generica di informazioni su immobili nella zona sud di Milano",
    budget: null,
    urgenza: "non indicata",
    bozza_email:
      "Gentile Mauro,\n\ngrazie per averci scritto. Per inviarle proposte utili: sta cercando di acquistare o di vendere nella zona sud di Milano?\n\nCordiali saluti,\nVisconti Immobiliare",
    stato: "nuovo",
    // Molto presto (UTC) così un lead inviato live in call finisce sempre in cima
    giorniFa: 0,
    ora: "05:45:00",
  },
];
