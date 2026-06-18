"use client";

import { useEffect, useState } from "react";
import type { Lead, Stato, SlotAppuntamento } from "@/lib/types";

const BADGE_CATEGORIA: Record<string, string> = {
  caldo: "bg-red-100 text-red-700",
  tiepido: "bg-amber-100 text-amber-700",
  freddo: "bg-sky-100 text-sky-700",
  spam: "bg-slate-200 text-slate-500",
};

const LABEL_CATEGORIA: Record<string, string> = {
  caldo: "🔥 Caldo",
  tiepido: "🌤 Tiepido",
  freddo: "❄️ Freddo",
  spam: "🚫 Spam",
};

function scoreColor(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-400";
}

function parseSlots(json: string): SlotAppuntamento[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [errore, setErrore] = useState("");
  const [aperto, setAperto] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/leads")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Errore di caricamento");
        setLeads(json.leads);
      })
      .catch((err: Error) => setErrore(err.message));
  }, []);

  async function cambiaStato(id: number, stato: Stato) {
    // aggiornamento ottimistico
    setLeads((prev) =>
      prev ? prev.map((l) => (l.id === id ? { ...l, stato } : l)) : prev
    );
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stato }),
    });
    if (!res.ok) setErrore("Aggiornamento stato non riuscito.");
  }

  if (errore && !leads) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        {errore}
      </div>
    );
  }

  if (!leads) {
    return (
      <div className="flex items-center gap-3 text-slate-500 py-20 justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--primary)]" />
        Caricamento lead…
      </div>
    );
  }

  const totale = leads.length;
  const caldi = leads.filter((l) => l.categoria === "caldo").length;
  const percCaldi = totale > 0 ? Math.round((caldi / totale) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Metriche */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Lead totali</p>
          <p className="mt-1 text-3xl font-bold">{totale}</p>
          <p className="mt-1 text-xs text-slate-400">qualificati automaticamente</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Lead caldi</p>
          <p className="mt-1 text-3xl font-bold text-[var(--primary)]">{percCaldi}%</p>
          <p className="mt-1 text-xs text-slate-400">{caldi} su {totale} pronti da chiamare</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Tempo medio di risposta</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">2 min</p>
          <p className="mt-1 text-xs text-slate-400">
            vs <span className="line-through">4 ore</span> con gestione manuale
          </p>
        </div>
      </div>

      {/* Tabella lead */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold">Lead ricevuti</h2>
          <p className="text-xs text-slate-400">
            Clicca su una riga per vedere dati estratti e bozza email
          </p>
        </div>

        {totale === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">
            Nessun lead ancora. Esegui <code className="font-mono">npm run seed</code> o
            invia una richiesta dal form pubblico.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-5 py-3">Score</th>
                  <th className="px-3 py-3">Categoria</th>
                  <th className="px-3 py-3">Contatto</th>
                  <th className="px-3 py-3">Esigenza</th>
                  <th className="px-3 py-3">Budget</th>
                  <th className="px-3 py-3">Urgenza</th>
                  <th className="px-3 py-3">Stato</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <Riga
                    key={lead.id}
                    lead={lead}
                    aperto={aperto === lead.id}
                    onToggle={() => setAperto(aperto === lead.id ? null : lead.id)}
                    onStato={(s) => cambiaStato(lead.id, s)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {errore && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errore}
        </div>
      )}
    </div>
  );
}

function Riga({
  lead,
  aperto,
  onToggle,
  onStato,
}: {
  lead: Lead;
  aperto: boolean;
  onToggle: () => void;
  onStato: (s: Stato) => void;
}) {
  const slots = parseSlots(lead.slot_proposti);
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer align-top"
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${scoreColor(lead.score)}`}
            >
              {lead.score}
            </span>
          </div>
        </td>
        <td className="px-3 py-3.5">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${BADGE_CATEGORIA[lead.categoria] ?? "bg-slate-100"}`}
          >
            {LABEL_CATEGORIA[lead.categoria] ?? lead.categoria}
          </span>
        </td>
        <td className="px-3 py-3.5">
          <p className="font-medium">{lead.nome}</p>
          <p className="text-xs text-slate-400">{lead.email}</p>
        </td>
        <td className="px-3 py-3.5 max-w-60 text-slate-600">{lead.esigenza}</td>
        <td className="px-3 py-3.5 whitespace-nowrap">
          {lead.budget ?? <span className="text-slate-300">—</span>}
        </td>
        <td className="px-3 py-3.5 capitalize">{lead.urgenza}</td>
        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={lead.stato}
            onChange={(e) => onStato(e.target.value as Stato)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-[var(--primary)]"
          >
            <option value="nuovo">🆕 Nuovo</option>
            <option value="risposto">✉️ Risposto</option>
            <option value="appuntamento">📅 Appuntamento</option>
          </select>
        </td>
      </tr>
      {aperto && (
        <tr className="border-b border-slate-100 bg-slate-50/60">
          <td colSpan={7} className="px-5 py-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Messaggio originale
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap rounded-lg bg-white p-4 ring-1 ring-slate-200">
                  {lead.messaggio}
                </p>
                {slots.length > 0 && (
                  <>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mt-4 mb-2">
                      Slot proposti
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs ring-1 ring-slate-200"
                        >
                          📅 {s.giorno} · {s.ora}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                  Bozza email generata dall&apos;AI
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap rounded-lg bg-white p-4 ring-1 ring-slate-200">
                  {lead.bozza_email || "—"}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
