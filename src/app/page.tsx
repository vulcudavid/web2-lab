import { getCurrentUser } from "@/lib/auth";
import { AuthCard } from "@/components/auth-card";
import { RoleDashboardSkeleton } from "@/components/role-dashboard-skeleton";
import { logoutAction } from "@/app/actions/auth";
import { 
  Building2, 
  GraduationCap, 
  FileText, 
  Clock, 
  CheckCircle2, 
  GitBranch,
  ShieldCheck,
  LogOut,
  Sparkles
} from "lucide-react";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              P14
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight block">
                Portal Practică Inginerie
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                Universitatea „Lucian Blaga” din Sibiu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    {currentUser.role === "STUDENT"
                      ? "Student"
                      : currentUser.role === "COMPANY_TUTOR"
                      ? "Firmă / Tutore"
                      : "Coordonator"}
                  </span>
                </div>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-red-600 transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Deconectare</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Săptămâna 1: Skeleton & Auth
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
        {currentUser ? (
          /* VEDERE UTILIZATOR AUTENTIFICAT */
          <RoleDashboardSkeleton
            role={currentUser.role}
            userName={`${currentUser.firstName} ${currentUser.lastName}`}
          />
        ) : (
          /* VEDERE LANDING PAGE & AUTENTIFICARE */
          <>
            {/* Hero Section */}
            <header className="text-center space-y-4 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/80 text-blue-800 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Matching Profesional & Social • Facultatea de Inginerie ULBS
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Portal de Practică Universitară
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                Platforma dedicată studenților și companiilor partenere: matching stabil 
                prin algoritmul <strong>Gale-Shapley</strong>, convenții de practică PDF precompletate 
                și jurnal săptămânal de ore.
              </p>
            </header>

            {/* Auth Section */}
            <section className="py-2">
              <AuthCard />
            </section>

            {/* Overview Skeleton Grid */}
            <section className="space-y-6 pt-8 border-t border-slate-200">
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Modulele Platformei (Skeleton Preview)</h2>
                <p className="text-xs text-slate-500">Fluxul complet de lucru conform calendarului de dezvoltare</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Modul Studenți</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Profil cu bio și competențe pe domenii inginerești (CTI, Electronică, Mecatronică), 
                    feed de oferte cu scor de compatibilitate și protecție strictă a CV-ului.
                  </p>
                  <div className="pt-2 flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">CV protejat</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">Preferințe Gale-Shapley</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Modul Companii</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Publicare oferte de practică cu capacități limitate, ordonare aplicanți, 
                    programare sloturi de interviu și validare ore de către tutore.
                  </p>
                  <div className="pt-2 flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">Clasament candidați</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">Validare pontaj</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Modul Coordonator</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Rulare algoritm Gale-Shapley stabil, gestionare excepții prin realocare minimală, 
                    generare convenții PDF și dashboard centralizat.
                  </p>
                  <div className="pt-2 flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">Gale-Shapley</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600">Convenții PDF</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200">
          Laborator Web 2 • Universitatea „Lucian Blaga” din Sibiu • Proiect P14 Portal de Practică
        </footer>
      </div>
    </main>
  );
}
