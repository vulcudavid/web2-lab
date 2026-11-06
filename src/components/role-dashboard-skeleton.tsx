import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Sparkles, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Lock
} from "lucide-react";
import { UserRole } from "@prisma/client";

interface Props {
  role: UserRole;
  userName: string;
}

export function RoleDashboardSkeleton({ role, userName }: Props) {
  if (role === "STUDENT") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Banner Profil Student */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-2xl">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/40 text-blue-100 mb-1">
                  Profil Student • Anul 3 CTI
                </span>
                <h2 className="text-2xl font-bold">Bine ai venit, {userName}!</h2>
                <p className="text-xs text-blue-100">
                  Facultatea de Inginerie ULBS • Domeniu: Calculatoare și Tehnologia Informației
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-xs font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Scor mediu compatibilitate: 87%
              </span>
            </div>
          </div>
        </div>

        {/* Skeleton Grid Student */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coloana 1: Feed Oferte Recomandate (Scor & Gale-Shapley) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Oferte de Practică Recomandate (Matching Inteligent)
              </h3>
              <span className="text-xs text-slate-500">Ordonat după scorul de compatibilitate</span>
            </div>

            {/* Skeleton Card 1 (Continental) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Continental Automotive Sibiu</span>
                  <h4 className="font-bold text-slate-900 text-base">Software Engineering Intern - Connected Mobility</h4>
                  <p className="text-xs text-slate-500 mt-1">Sibiu • Hibrid • 3 locuri disponibile • Perioadă: Iul - Sep 2026</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  87% Compatibil
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">TypeScript</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">React</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">Docker</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">Git / GitHub</span>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-400">Tutore: Elena Popa (Lead Software Architect)</span>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg"></div>
                  <div className="h-8 w-28 bg-blue-600/30 animate-pulse rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Skeleton Card 2 (Placeholder) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 opacity-75">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-slate-200 animate-pulse rounded"></div>
                  <div className="h-5 w-64 bg-slate-300 animate-pulse rounded"></div>
                  <div className="h-3 w-48 bg-slate-200 animate-pulse rounded"></div>
                </div>
                <div className="h-6 w-20 bg-slate-200 animate-pulse rounded-full"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-slate-100 animate-pulse rounded"></div>
                <div className="h-4 w-20 bg-slate-100 animate-pulse rounded"></div>
                <div className="h-4 w-14 bg-slate-100 animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Coloana 2: Stare Plasament & Jurnal Pontaj */}
          <div className="space-y-6">
            {/* Plasament Gale-Shapley */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Stare Plasament & Convenție PDF
              </h3>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-800 space-y-1">
                <p className="font-semibold">Algoritmul Gale-Shapley este în așteptare</p>
                <p className="text-purple-600">
                  Coordonatorul facultății va rula algoritmul la încheierea etapei de exprimare a preferințelor.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Convenție de practică PDF:</span>
                  <span className="font-medium text-slate-700">Se generează după alocare</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-1/3"></div>
                </div>
              </div>
            </div>

            {/* Jurnal Pontaj Ore */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Jurnal Săptămânal Pontaj
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">Total ore validate:</span>
                  <span className="font-bold text-emerald-700">0 / 90 ore</span>
                </div>
                <div className="h-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Modul activ după începerea stagiului
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === "COMPANY_TUTOR") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Banner Tutore Firmă */}
        <div className="bg-gradient-to-r from-indigo-700 to-slate-800 rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-2xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/40 text-indigo-100 mb-1">
                  Panou Companie Parteneră • Tutore Desemnat
                </span>
                <h2 className="text-2xl font-bold">Bună ziua, {userName}!</h2>
                <p className="text-xs text-indigo-200">
                  Continental Automotive Sibiu • Gestionare oferte, interviuri și aplicanți
                </p>
              </div>
            </div>
            <div className="h-9 w-32 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center text-xs font-medium">
              + Publică Ofertă Nouă
            </div>
          </div>
        </div>

        {/* Skeleton Grid Firmă */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Oferte Active */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Oferte de Practică Publicate & Candidați Înscriși
            </h3>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Software Engineering Intern - Connected Mobility</h4>
                  <p className="text-xs text-slate-500">Capacitate: 3 locuri • 1 aplicant înscris</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                  Activă
                </span>
              </div>

              {/* Aplicanți cu Regula de Privacy pe CV */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Clasament Candidați Aplicanți:</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    CV accesibil (studentul a aplicat)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      AR
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Alexandru Radu</p>
                      <p className="text-[11px] text-slate-500">Calculatoare Anul 3 • Scor: 87%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded text-xs font-medium">
                      Vezi CV (PDF)
                    </span>
                    <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                      Programează Interviu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validare Pontaj */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Validare Jurnale de Practică
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center text-xs text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Niciun pontaj în așteptare pentru validare.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COORDINATOR
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner Coordonator */}
      <div className="bg-gradient-to-r from-purple-700 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/40 text-purple-100 mb-1">
                Panou de Administrare & Coordonare Practică
              </span>
              <h2 className="text-2xl font-bold">Bună ziua, Coordonator {userName}!</h2>
              <p className="text-xs text-purple-200">
                Facultatea de Inginerie ULBS • Monitorizare stagiari, matching Gale-Shapley și convenții
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition shadow">
              ⚡ Rulează Algoritm Gale-Shapley
            </button>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Studenți Înscriși</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">128</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">85% cu preferințe exprimate</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Companii Partenere</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
          <p className="text-[11px] text-blue-600 mt-0.5">Continental, Siemens, etc.</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Locuri Ofertate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">145</p>
          <p className="text-[11px] text-purple-600 mt-0.5">Capacitate excedentară</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Convenții Semnate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">0 / 128</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Se emit după matching</p>
        </div>
      </div>

      {/* Skeleton Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Centralizator Studenți & Alocări
          </h3>
          <span className="text-xs text-slate-400">Filtrează după domeniu / an</span>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-slate-50 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-slate-50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
