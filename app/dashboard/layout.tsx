import Link from "next/link";
import { businessConfig as config } from "@/config/business";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white font-bold">
              {config.logoTestuale}
            </span>
            <div>
              <p className="font-semibold leading-tight">{config.nomeAzienda}</p>
              <p className="text-xs text-slate-500">
                LeadPilot · Qualificazione lead con AI
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition"
            >
              Form pubblico
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition"
            >
              Lead
            </Link>
            <Link
              href="/dashboard/report"
              className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition"
            >
              Report settimanale
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
