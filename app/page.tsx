"use client";

import { useState } from "react";
import Link from "next/link";
import { businessConfig as config } from "@/config/business";

type FormState = "idle" | "sending" | "ok" | "error";

export default function FormPubblico() {
  const [state, setState] = useState<FormState>("idle");
  const [errore, setErrore] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setState("sending");
    setErrore("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrore(json.error ?? "Si è verificato un errore. Riprova.");
        setState("error");
        return;
      }
      form.reset();
      setState("ok");
    } catch {
      setErrore("Connessione non riuscita. Controlla la rete e riprova.");
      setState("error");
    }
  }

  return (
    <main className="flex-1">
      {/* Header brand */}
      <header className="bg-[var(--primary)] text-white">
        <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold tracking-wide">
              {config.logoTestuale}
            </span>
            <div>
              <p className="text-lg font-semibold leading-tight">{config.nomeAzienda}</p>
              <p className="text-sm text-white/80">{config.settore}</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25 transition"
          >
            Area riservata →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[var(--primary)] text-white pb-16">
        <div className="mx-auto max-w-3xl px-6 pt-10">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Raccontaci il tuo progetto
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">{config.descrizioneServizi}</p>
        </div>
      </section>

      {/* Form card */}
      <section className="mx-auto max-w-3xl px-6 -mt-10 pb-16">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-slate-200">
          {state === "ok" ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                ✓
              </div>
              <h2 className="text-xl font-semibold">Richiesta inviata!</h2>
              <p className="mt-2 text-slate-600">
                Grazie per averci contattato. Ti risponderemo a breve con una proposta
                personalizzata.
              </p>
              <button
                onClick={() => setState("idle")}
                className="mt-6 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
              >
                Invia un&apos;altra richiesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium mb-1.5">
                    Nome e cognome *
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    required
                    placeholder="Mario Rossi"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="mario.rossi@email.it"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium mb-1.5">
                  Telefono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+39 333 1234567"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
              <div>
                <label htmlFor="messaggio" className="block text-sm font-medium mb-1.5">
                  Descrivi la tua richiesta *
                </label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  required
                  rows={5}
                  placeholder={config.esempioRichiesta}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 resize-y"
                />
              </div>

              {state === "error" && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {errore}
                </div>
              )}

              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full rounded-lg bg-[var(--primary)] px-5 py-3 font-medium text-white hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state === "sending" ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Invio in corso…
                  </span>
                ) : (
                  "Invia richiesta"
                )}
              </button>
              <p className="text-xs text-slate-400 text-center">
                Riceverai una risposta personalizzata in pochi minuti.
              </p>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Demo LeadPilot — form contatti di {config.nomeAzienda}
      </footer>
    </main>
  );
}
