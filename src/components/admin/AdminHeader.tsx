"use client";

import { Menu, Bell, Search, LogOut } from "lucide-react";
import { logoutAdminAction } from "@/actions/auth";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  userEmail?: string;
  userName?: string | null;
}

export function AdminHeader({
  onOpenMobileMenu,
  userEmail,
  userName,
}: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-[#ebebeb] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-neutral-600 hover:bg-[#f2f4f5] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#787574]">
          <span className="font-medium text-[#000000]">Admin Workspace</span>
          <span>/</span>
          <span>Control Center</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Pill & Sign Out */}
        <div className="flex items-center gap-2 pl-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-[#000000]">
              {userName || "Store Admin"}
            </div>
            <div className="text-[11px] text-[#787574]">{userEmail}</div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#5433eb] text-white flex items-center justify-center text-xs font-bold ring-2 ring-[#ebebeb]">
            {(userName || userEmail || "A").charAt(0).toUpperCase()}
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="ml-1 px-3 py-1.5 rounded-full border border-[#ebebeb] text-xs font-medium text-neutral-700 hover:bg-[#f2f4f5] hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
