import { requireAdmin } from "@/lib/firebase/session";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AdminHeader session={session} />
      <main>{children}</main>
    </div>
  );
}
