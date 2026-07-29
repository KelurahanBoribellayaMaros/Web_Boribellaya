import { requireAdmin } from "@/lib/firebase/session";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader session={session} />
      <main>{children}</main>
    </div>
  );
}
