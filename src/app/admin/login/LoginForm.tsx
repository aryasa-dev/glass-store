"use client";

import { useActionState, useState } from "react";
import { loginAdminAction, type AuthState } from "@/actions/auth";
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    loginAdminAction,
    null
  );

  const [email, setEmail] = useState("admin@store.local");
  const [password, setPassword] = useState("admin123");

  const handlePrefill = () => {
    setEmail("admin@store.local");
    setPassword("admin123");
  };

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-neutral-700 tracking-tight">
          Admin Email
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@store.local"
            className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-[#ebebeb] text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-neutral-700 tracking-tight">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-[#ebebeb] text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="pt-2 border-t border-[#ebebeb] flex items-center justify-between text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Secure Admin Gateway
        </span>
        <button
          type="button"
          onClick={handlePrefill}
          className="text-[#5433eb] hover:underline font-medium"
        >
          Use Demo Credentials
        </button>
      </div>
    </form>
  );
}
