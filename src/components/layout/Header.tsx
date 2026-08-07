"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CircleUserRound,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  Settings,
  User,
  Wrench,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { markNotificationsSeenAction } from "@/lib/actions/notification-actions";
import type { Session } from "@/lib/firebase/session";
import { statusLabels } from "@/types/permohonan";
import type { PermohonanStatus } from "@/types/permohonan";
import type { NotificationData, NotificationItem } from "@/types/notification";
import { timeAgo } from "@/lib/home-data";

type NavLink = (
  | { type: "anchor"; id: string }
  | { type: "page"; href: string }
) & { label: string; icon: LucideIcon };

const navLinks: NavLink[] = [
  { label: "Beranda", type: "anchor", id: "beranda", icon: Home },
  { label: "Profil", type: "page", href: "/profil", icon: User },
  { label: "Berita", type: "page", href: "/berita", icon: Newspaper },
  { label: "Layanan", type: "page", href: "/layanan", icon: Wrench },
  { label: "Informasi Publik", type: "page", href: "/informasi-publik", icon: FileText },
  { label: "Kontak", type: "page", href: "/kontak", icon: MapPin },
];

function linkHref(link: NavLink): string {
  if (link.type === "anchor") return `/#${link.id}`;
  return link.href;
}

const statusDotClass: Record<PermohonanStatus, string> = {
  baru: "bg-amber-500",
  diverifikasi: "bg-blue-500",
  selesai: "bg-green-500",
  ditolak: "bg-red-500",
};

function notificationMessage(item: NotificationItem): string {
  const kind = item.type === "informasi" ? "permohonan informasi" : "permohonan layanan";
  return `Status ${kind} "${item.categoryLabel}" berubah menjadi ${statusLabels[item.status]}.`;
}

export function Header({
  session,
  notifications,
}: {
  session: Session | null;
  notifications: NotificationData | null;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("beranda");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications?.unreadCount ?? 0);
  const [isScrolled, setIsScrolled] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAccountMenuOpen && !isNotifOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
        setIsNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen, isNotifOpen]);

  function handleNotifToggle() {
    setIsNotifOpen((open) => {
      const next = !open;
      if (next && session && unreadCount > 0) {
        setUnreadCount(0);
        markNotificationsSeenAction().catch(() => {});
      }
      return next;
    });
  }

  useEffect(() => {
    if (!isHome) return;

    const anchorIds = navLinks
      .filter((link): link is Extract<NavLink, { type: "anchor" }> => link.type === "anchor")
      .map((link) => link.id);
    const headerOffset = 160;

    let ticking = false;

    function updateActive() {
      let current = anchorIds[0];
      for (const id of anchorIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= headerOffset) {
          current = id;
        }
      }
      setActiveId(current);
      setIsScrolled(window.scrollY > 20);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  function isLinkActive(link: NavLink): boolean {
    if (link.type === "page") return pathname === link.href;
    return isHome && activeId === link.id;
  }

  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${isTransparent ? "bg-transparent" : "bg-[#003459]"
        }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-2 py-3 sm:px-3 lg:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link href="/#beranda" className="flex items-center gap-2.5">
            <Image
              src="/images/logo-maros.png"
              alt="Logo Kabupaten Maros"
              width={36}
              height={36}
              className="size-8 object-contain sm:size-9"
            />
            <span className="leading-tight">
              <span className="block text-base font-bold text-white sm:text-lg">
                Kelurahan Boribellaya
              </span>
              <span className="block text-xs text-[#d8d6d4]">
                Kabupaten Maros
              </span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);

            return (
              <Link
                key={link.label}
                href={linkHref(link)}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1 text-sm font-medium text-white transition-colors after:absolute after:inset-x-0 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-white after:transition-opacity ${isActive
                  ? "after:opacity-100"
                  : "after:opacity-0 hover:after:opacity-100"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <div className="relative" ref={notifMenuRef}>
            <button
              type="button"
              onClick={handleNotifToggle}
              className="relative flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              aria-label="Notifikasi"
              aria-expanded={isNotifOpen}
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-bold text-gray-900">Notifikasi</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {!notifications || notifications.items.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-500">
                      Belum ada notifikasi.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {notifications.items.map((item) => (
                        <li
                          key={item.id}
                          className={`px-4 py-3 ${item.isUnread ? "bg-green-50/60" : ""}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-1.5 size-2 shrink-0 rounded-full ${statusDotClass[item.status]}`}
                            />
                            <div className="min-w-0">
                              <p className="text-sm text-gray-700">
                                {notificationMessage(item)}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-400">
                                {timeAgo(item.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
          {session ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-label="Menu akun"
                aria-expanded={isAccountMenuOpen}
                className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:hidden"
              >
                <CircleUserRound className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-expanded={isAccountMenuOpen}
                className="hidden items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:flex"
              >
                <CircleUserRound className="size-4" />
                {(session.name?.split(" ")[0] ?? session.email) || "Akun"}
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {session.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard Admin
                    </Link>
                  )}
                  <Link
                    href="/akun/permohonan"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Inbox className="size-4" />
                    Riwayat Permohonan
                  </Link>
                  <Link
                    href="/akun"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Settings className="size-4" />
                    Ubah Kredensial
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Keluar
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:hidden"
                aria-label="Masuk"
              >
                <CircleUserRound className="size-5" />
              </Link>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:flex"
              >
                <CircleUserRound className="size-4" />
                Masuk
              </Link>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-white/10 bg-[#003459] px-2 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <li key={link.label}>
                  <Link
                    href={linkHref(link)}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isActive
                      ? "bg-white/10 text-white"
                      : "text-green-100/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <link.icon className="size-5 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}