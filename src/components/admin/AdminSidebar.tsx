"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Calculator,
  ShoppingCart,
  Store,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { logoutAdminAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Calculator Rules",
    href: "/admin/calculator-rules",
    icon: Calculator,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string | null;
}

export function AdminSidebar({
  isOpen,
  onClose,
  userEmail,
  userName,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Rail / Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#ebebeb] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Top Brand Section */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#ebebeb]">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-[#000000]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#5433eb] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(69,36,219,0.3)]">
                S
              </div>
              <span className="flex items-center">
                Shop<span className="text-[#5433eb] text-xl leading-none">.</span>
                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#f2f4f5] text-neutral-600 font-semibold uppercase tracking-wider">
                  Admin
                </span>
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 lg:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-[#787574] uppercase tracking-wider">
              Management
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-[20px] text-sm font-medium transition-all group",
                    isActive
                      ? "bg-[#f2f4f5] text-[#000000] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      : "text-[#787574] hover:bg-[#f2f4f5]/60 hover:text-[#000000]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive
                        ? "text-[#5433eb]"
                        : "text-[#787574] group-hover:text-[#000000]"
                    )}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#5433eb]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account / Sign Out */}
        <div className="p-4 border-t border-[#ebebeb] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-full border border-[#ebebeb] text-xs font-medium text-neutral-700 hover:bg-[#f2f4f5] transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#5433eb]" />
            <span>View Public Store</span>
          </Link>

          {/* Profile Card */}
          <div className="p-3 rounded-2xl bg-[#f2f4f5] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-[#000000] truncate">
                {userName || "Store Admin"}
              </p>
              <p className="text-[11px] text-[#787574] truncate">
                {userEmail || "admin@store.local"}
              </p>
            </div>
            <form action={logoutAdminAction}>
              <button
                type="submit"
                title="Sign Out"
                className="p-1.5 rounded-xl hover:bg-white text-neutral-500 hover:text-red-600 transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
