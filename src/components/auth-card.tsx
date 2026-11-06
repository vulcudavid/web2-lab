"use client";

import { useState, useActionState } from "react";
import { loginAction, registerAction } from "@/app/actions/auth";
import { GraduationCap, Building2, ShieldCheck, LogIn, UserPlus, Sparkles } from "lucide-react";

export function AuthCard() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "COMPANY_TUTOR" | "COORDINATOR">("STUDENT");

  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, null);
  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerAction, null);

  const [quickLoginEmail, setQuickLoginEmail] = useState("");
  const [quickLoginPassword, setQuickLoginPassword] = useState("");

  const handleQuickFill = (email: string, pass: string) => {
    setTab("login");
    setQuickLoginEmail(email);
    setQuickLoginPassword(pass);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            tab === "login"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <LogIn className="w-4 h-4" />
          Conectare
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            tab === "register"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Înregistrare Cont Nou
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* LOGIN FORM */}
        {tab === "login" && (
          <form action={loginFormAction} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Adresă de Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={quickLoginEmail}
                onChange={(e) => setQuickLoginEmail(e.target.value)}
                placeholder="exemplu@student.ulbsibiu.ro"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Parolă
              </label>
              <input
                type="password"
                name="password"
                required
                value={quickLoginPassword}
                onChange={(e) => setQuickLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {loginState?.error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {loginState.error}
              </div>
            )}

            {loginState?.message && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                {loginState.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoginPending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
            >
              {isLoginPending ? "Se autentifică..." : "Autentificare"}
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Conturi demo preconfigurate (1-click):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill("alexandru.radu@student.ulbsibiu.ro", "demo_hash_student")}
                  className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium text-center transition"
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("recruitment@continental-sibiu.com", "demo_hash_company")}
                  className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium text-center transition"
                >
                  Firmă (Tutor)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("coordonator.practica@ulbsibiu.ro", "demo_hash_coordonator")}
                  className="px-2 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-medium text-center transition"
                >
                  Coordonator
                </button>
              </div>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === "register" && (
          <form action={registerFormAction} className="space-y-4">
            {/* Role Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Alegeți Tipul de Cont
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole("STUDENT")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRole === "STUDENT"
                      ? "border-blue-600 bg-blue-50/70 text-blue-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-xs">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("COMPANY_TUTOR")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRole === "COMPANY_TUTOR"
                      ? "border-blue-600 bg-blue-50/70 text-blue-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs">Firmă / Tutore</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("COORDINATOR")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRole === "COORDINATOR"
                      ? "border-blue-600 bg-blue-50/70 text-blue-700 font-semibold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs">Coordonator</span>
                </button>
              </div>
              <input type="hidden" name="role" value={selectedRole} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Prenume
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="Ion"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nume de Familie
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Popescu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="ion.popescu@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Parolă (min. 6 caractere)
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Câmpuri specifice STUDENT */}
            {selectedRole === "STUDENT" && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Specializare</label>
                    <input
                      type="text"
                      name="specialization"
                      defaultValue="Calculatoare"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">An de Studiu</label>
                    <select
                      name="studyYear"
                      defaultValue={3}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value={1}>Anul 1</option>
                      <option value={2}>Anul 2</option>
                      <option value={3}>Anul 3</option>
                      <option value={4}>Anul 4</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Domeniu Inginerie</label>
                  <select
                    name="domain"
                    defaultValue="COMPUTER_SCIENCE_IT"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="COMPUTER_SCIENCE_IT">Calculatoare & Tehnologia Informației</option>
                    <option value="ELECTRONICS_TELECOM">Electronică și Telecomunicații</option>
                    <option value="ROBOTICS_MECHATRONICS">Mecatronică și Robotică</option>
                    <option value="INDUSTRIAL_MANAGEMENT">Inginerie Industrială / Management</option>
                    <option value="GENERAL_ENGINEERING">Inginerie Generală</option>
                  </select>
                </div>
              </div>
            )}

            {/* Câmpuri specifice FIRMĂ */}
            {selectedRole === "COMPANY_TUTOR" && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Denumire Companie</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    placeholder="ex: Siemens / Continental / Marquardt"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">CUI / CIF</label>
                    <input
                      type="text"
                      name="cuiCif"
                      required
                      placeholder="RO12345678"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Oraș</label>
                    <input
                      type="text"
                      name="city"
                      defaultValue="Sibiu"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {registerState?.error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {registerState.error}
              </div>
            )}

            {registerState?.message && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
                {registerState.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isRegisterPending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
            >
              {isRegisterPending ? "Se creează contul..." : "Finalizează Înregistrarea"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
