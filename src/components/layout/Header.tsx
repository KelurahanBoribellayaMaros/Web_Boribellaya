"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Menu, Search, X } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import type { Session } from "@/lib/firebase/session";

type NavLink =
  | { label: string; type: "anchor"; id: string }
  | { label: string; type: "page"; href: string };

const navLinks: NavLink[] = [
  { label: "Beranda", type: "anchor", id: "beranda" },
  { label: "Berita", type: "page", href: "/berita" },
  { label: "Data Penduduk", type: "anchor", id: "data-penduduk" },
  { label: "Layanan", type: "page", href: "/layanan" },
  { label: "Profil", type: "page", href: "/profil" },
];

function linkHref(link: NavLink): string {
  return link.type === "anchor" ? `/#${link.id}` : link.href;
}

export function Header({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("beranda");

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

  return (
    <header className="sticky top-0 z-30 bg-green-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
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
              <span className="block text-xs text-green-100/80">
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
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white after:absolute after:inset-x-0 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-white"
                    : "text-green-100/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            aria-label="Cari"
          >
            <Search className="size-5" />
          </button>
          {session ? (
            <>
              <form action={logoutAction} className="sm:hidden">
                <button
                  type="submit"
                  className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                  title="Keluar"
                  aria-label="Keluar"
                >
                  <CircleUserRound className="size-5" />
                </button>
              </form>
              <form action={logoutAction} className="hidden sm:block">
                <button
                  type="submit"
                  title="Keluar"
                  className="hidden items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:flex"
                >
                  <CircleUserRound className="size-4" />
                  {(session.name?.split(" ")[0] ?? session.email) || "Akun"}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:hidden"
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
        <nav className="border-t border-white/10 bg-green-800 px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link);
              return (
                <li key={link.label}>
                  <Link
                    href={linkHref(link)}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-green-100/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
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