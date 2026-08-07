import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { ToastListener } from "@/components/ui/ToastListener";
import { getSession } from "@/lib/firebase/session";
import { getNotificationsForUser } from "@/lib/firebase/notifications-repository";
import { getKontakInfo } from "@/lib/firebase/kontak-repository";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kelurahan Boribellaya",
  description:
    "Portal resmi Kelurahan Boribellaya — layanan publik, informasi terkini, dan administrasi kependudukan.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const notifications = session?.email
    ? await getNotificationsForUser(session.uid, session.email)
    : null;
  const kontak = await getKontakInfo();

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ToastProvider>
          <Suspense fallback={null}>
            <ToastListener />
          </Suspense>
          <SiteChrome session={session} notifications={notifications} kontak={kontak}>
            {children}
          </SiteChrome>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
