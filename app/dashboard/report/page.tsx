"use client";

import { useEffect, useState } from "react";

interface Report {
  contenuto: string;
  created_at: string;
}

/** Renderer Markdown minimale (titoli ##, elenchi -, **grassetto**) */
function RenderReport({ testo }: { testo: string }) {
  const righe = testo.split("\n");
  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      {righe.map((riga, i) => {
        const grassetto = (s: string) =>
          s.split(/(\*\*[^*]+\*\*)/g).map((parte, j) =>
            parte.startsWith("**") && parte.endsWith("**") ? (
              <strong key={j}>{parte.slice(2, -2)}</strong>
            ) : (
              parte
            )
          );
        if (riga.startsWith("## ")) {
          return (
            <h2 key={i} className="text-base font-semibold text-slate-900 pt-3">
              {riga.slice(3)}
            </h2>
          );
        }
        if (riga.startsWith("# ")) {
          return (
            <h1 key={i} className="text-lg font-bold text-slate-900 pt-2">
              {riga.slice(2)}
            </h1>
          );
        }
        if (/^\s*[-*]\s+/.test(riga)) {
          return (
            <p key={i} className="pl-5 relative">
              <span className="absolute left-1 text-[var(--primary)]">•</span>
              {grassetto(riga.replace(/^\s*[-*]\s+/, ""))}
            </p>
          );
        }
        if (riga.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i}>{grassetto(riga)}</p>;
      })}
    </div>
  );
}

export default function ReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [generando, setGenerando] = useState(false);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((json) => {
        if (json.report) setReport(json.report);
      })
      .catch(() => {});
  }, []);

  async function genera() {
    setGenerando(true);
    setErrore("");
    try {
      const res = await fetch("/api/report", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setErrore(json.error ?? "Generazione non riuscita.");
        return;
      }
      setReport(json.report);
    } catch {
      setErrore("Connessione non riuscita. Riprova.");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Report settimanale</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analisi AI dei lead: andamento, temi ricorrenti e suggerimenti operativi.
          </p>
        </div>
        <button
          onClick={genera}
          disabled={generando}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generando ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Generazione in corso…
            </span>
          ) : report ? (
            "↻ Rigenera report"
          ) : (
            "✨ Genera report"
          )}
        </button>
      </div>

      {errore && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errore}
        </div>
      )}

      {report ? (
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs text-slate-400 mb-4">
            Generato il {new Date(report.created_at).toLocaleString("it-IT")}
          </p>
          <RenderReport testo={report.contenuto} />
        </div>
      ) : (
        !generando && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-sm text-slate-400">
            Nessun report ancora generato.
            <br />
            Premi <strong>“Genera report”</strong> per ottenere l&apos;analisi AI dei lead.
          </div>
        )
      )}
    </div>
  );
}
