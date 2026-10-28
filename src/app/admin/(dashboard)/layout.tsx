import { requireAdmin } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export const instant = false;

export const metadata = {
  title: "Admin Dashboard | Store Management",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminLayoutClient userEmail={admin.email} userName={admin.name}>
      {children}
    </AdminLayoutClient>
  );
}
