"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { Session } from "@/lib/firebase/session";
import type { NotificationData } from "@/types/notification";

export function SiteChrome({
  children,
  session,
  notifications,
}: {
  children: React.ReactNode;
  session: Session | null;
  notifications: NotificationData | null;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header session={session} notifications={notifications} />
      <main className="flex-1 bg-gradient-to-b from-green-50 to-white pt-16">{children}</main>
      <Footer />
    </>
  );
}
