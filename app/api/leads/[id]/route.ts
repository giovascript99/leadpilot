import { NextResponse } from "next/server";
import { updateLeadStato } from "@/lib/db";
import type { Stato } from "@/lib/types";

export const runtime = "nodejs";

const STATI: Stato[] = ["nuovo", "risposto", "appuntamento"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) {
    return NextResponse.json({ error: "ID non valido." }, { status: 400 });
  }

  let body: { stato?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const stato = body.stato as Stato;
  if (!STATI.includes(stato)) {
    return NextResponse.json(
      { error: `Stato non valido. Valori ammessi: ${STATI.join(", ")}.` },
      { status: 400 }
    );
  }

  try {
    const lead = await updateLeadStato(leadId, stato);
    if (!lead) {
      return NextResponse.json({ error: "Lead non trovato." }, { status: 404 });
    }
    return NextResponse.json({ lead });
  } catch (err) {
    console.error("PATCH /api/leads/[id]", err);
    return NextResponse.json(
      { error: "Aggiornamento non riuscito." },
      { status: 500 }
    );
  }
}
