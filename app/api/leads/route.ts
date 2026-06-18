import { NextResponse } from "next/server";
import { insertLead, listLeads } from "@/lib/db";
import { qualificaLead, messaggioErrore } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ leads: listLeads() });
  } catch (err) {
    console.error("GET /api/leads", err);
    return NextResponse.json(
      { error: "Impossibile leggere i lead dal database." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: { nome?: string; email?: string; telefono?: string; messaggio?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const nome = (body.nome ?? "").trim();
  const email = (body.email ?? "").trim();
  const telefono = (body.telefono ?? "").trim();
  const messaggio = (body.messaggio ?? "").trim();

  if (!nome || !email || !messaggio) {
    return NextResponse.json(
      { error: "Nome, email e messaggio sono obbligatori." },
      { status: 400 }
    );
  }

  try {
    const start = Date.now();
    const { risultato: q } = await qualificaLead({ nome, email, telefono, messaggio });
    const elapsed = Date.now() - start;

    const lead = insertLead({
      nome,
      email,
      telefono: telefono || null,
      messaggio,
      score: q.score,
      categoria: q.categoria,
      esigenza: q.esigenza,
      budget: q.budget,
      urgenza: q.urgenza,
      bozza_email: q.bozza_email,
      slot_proposti: JSON.stringify(q.slot_proposti),
      tempo_risposta_ms: elapsed,
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (err) {
    console.error("POST /api/leads", err);
    return NextResponse.json({ error: messaggioErrore(err) }, { status: 502 });
  }
}
