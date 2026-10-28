import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const instant = false;

export const metadata = {
  title: "Admin Login | Storefront Management",
  description: "Sign in to manage products, pricing calculators, and customer orders.",
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#f2f4f5] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#787574] hover:text-[#000000] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Storefront
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#ebebeb] text-neutral-600 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            Admin Portal
          </span>
        </div>

        <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border border-[#ebebeb]/50">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#5433eb]/10 text-[#5433eb] mx-auto flex items-center justify-center font-bold text-xl mb-4">
              <span className="relative">
                S<span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5433eb] absolute -top-0.5 -right-1"></span>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#000000]">
              Admin Control Center
            </h1>
            <p className="text-sm text-[#787574] mt-1.5">
              Enter your administrative credentials to continue.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-[#787574] mt-8">
          Precision Custom Glass &bull; E-Commerce Management System
        </p>
      </div>
    </div>
  );
}
