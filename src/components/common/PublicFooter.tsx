"use client";

import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, ShieldCheck, Sparkles } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#ebebeb] bg-white text-[#787574] text-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#000000]">
              <div className="w-8 h-8 rounded-xl bg-[#5433eb] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(69,36,219,0.3)]">
                S
              </div>
              <span className="flex items-center">
                Shop<span className="text-[#5433eb] text-2xl leading-none">.</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#787574]">
              High-precision architectural and residential custom glass fabrication. Toughened safety panels, mirrors, and shower partitions cut to exact specifications.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified Tempered Glass</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#000000] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#000000] transition-colors">
                  Home & Glass Calculator
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#000000] transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#000000] transition-colors">
                  About Our Foundry
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#000000] transition-colors">
                  Request Commercial Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#000000] uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=custom-glass" className="hover:text-[#000000] transition-colors">
                  Custom Cut Glass
                </Link>
              </li>
              <li>
                <Link href="/products?category=mirrors" className="hover:text-[#000000] transition-colors">
                  Architectural Mirrors
                </Link>
              </li>
              <li>
                <Link href="/products?category=shower-screens" className="hover:text-[#000000] transition-colors">
                  Shower Screens
                </Link>
              </li>
              <li>
                <Link href="/products?category=table-tops" className="hover:text-[#000000] transition-colors">
                  Glass Table Tops
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#000000] uppercase tracking-wider">
              Foundry & Showroom
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#5433eb] flex-shrink-0 mt-0.5" />
                <span>123 Precision Way, Industrial Park, San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5433eb] flex-shrink-0" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5433eb] flex-shrink-0" />
                <span>support@precisionglass.store</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#ebebeb] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; 2026 Shop. Precision Glass Fabrication. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-[#000000] underline font-medium">
              Admin Portal
            </Link>
            <Link href="/" className="hover:text-[#000000]">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-[#000000]">
              Terms of Fabrication
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
