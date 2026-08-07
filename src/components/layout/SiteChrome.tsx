"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { KontakInfo } from "@/types/kontak";

export function SiteChrome({
  children,
  kontak,
}: {
  children: React.ReactNode;
  kontak: KontakInfo;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-green-50 to-white pt-16">{children}</main>
      <Footer kontak={kontak} />
    </>
  );
}
