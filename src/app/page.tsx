import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Storefront</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#5433eb]" />
              <span>Admin Panel</span>
            </Link>
            <Button size="sm" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Cart (0)
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5" />
            Next.js App Router & Tailwind CSS Ready
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Modern E-Commerce Starter
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Pre-configured with TypeScript, Tailwind CSS, Lucide icons, Server
            Actions, and utility helpers.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2">
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              Explore Docs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Fast Delivery</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Standardized folder structures for components, lib utilities, and server actions.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Type Safe</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Full TypeScript integration with strict type checking and zero runtime compromises.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Utility Powered</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Equipped with clsx, tailwind-merge, and lucide-react for rapid UI development.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
