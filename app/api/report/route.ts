import { NextResponse } from "next/server";
import { listLeads, saveReport, getLastReport } from "@/lib/db";
import { generaReportSettimanale, messaggioErrore } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    const report = await getLastReport();
    return NextResponse.json({ report: report ?? null });
  } catch (err) {
    console.error("GET /api/report", err);
    return NextResponse.json(
      { error: "Impossibile leggere il report." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const leads = await listLeads();
    if (leads.length === 0) {
      return NextResponse.json(
        { error: "Nessun lead nel database: esegui prima `npm run seed` o invia un lead dal form." },
        { status: 400 }
      );
    }
    const contenuto = await generaReportSettimanale(leads);
    await saveReport(contenuto);
    return NextResponse.json({
      report: { contenuto, created_at: new Date().toISOString() },
    });
  } catch (err) {
    console.error("POST /api/report", err);
    return NextResponse.json({ error: messaggioErrore(err) }, { status: 502 });
  }
}
