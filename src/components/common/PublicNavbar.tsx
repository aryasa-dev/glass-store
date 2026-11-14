"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartNavButton } from "@/components/cart/CartNavButton";
import { LayoutDashboard, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Catalog" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact & Inquiries" },
  ];

  return (
    <header className="border-b border-[#ebebeb] bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#000000]">
            <div className="w-8 h-8 rounded-xl bg-[#5433eb] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(69,36,219,0.3)]">
              S
            </div>
            <span className="flex items-center">
              Shop<span className="text-[#5433eb] text-2xl leading-none">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all ${
                    isActive
                      ? "bg-[#f2f4f5] text-[#000000] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      : "text-[#787574] hover:text-[#000000] hover:bg-[#f2f4f5]/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ebebeb] text-xs font-semibold text-neutral-700 hover:bg-[#f2f4f5] transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#5433eb]" />
            <span>Admin</span>
          </Link>

          <CartNavButton />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-neutral-600 hover:bg-[#f2f4f5] md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ebebeb] bg-white p-4 space-y-2 animate-in slide-in-from-top-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-full text-xs font-semibold ${
                pathname === link.href
                  ? "bg-[#f2f4f5] text-[#000000]"
                  : "text-[#787574] hover:bg-[#f2f4f5]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#ebebeb]">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-neutral-700 hover:bg-[#f2f4f5]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#5433eb]" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
