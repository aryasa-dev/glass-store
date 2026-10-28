"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string | null;
}

export function AdminLayoutClient({
  children,
  userEmail,
  userName,
}: AdminLayoutClientProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f4f5] flex">
      <AdminSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        userEmail={userEmail}
        userName={userName}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          userEmail={userEmail}
          userName={userName}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
