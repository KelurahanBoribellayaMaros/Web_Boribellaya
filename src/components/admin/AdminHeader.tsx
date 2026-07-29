"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import type { Session } from "@/lib/firebase/session";

export function AdminHeader({ session }: { session: Session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="bg-[#003f88]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-2 py-3 sm:px-3 lg:px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
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
            <span className="block text-xs text-[#d8d6d4]">Panel Admin</span>
          </span>
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Menu akun"
            aria-expanded={isMenuOpen}
            className="flex items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <CircleUserRound className="size-4" />
            <span className="hidden sm:inline">
              {(session.name?.split(" ")[0] ?? session.email) || "Admin"}
            </span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <Link
                href="/akun"
                onClick={() => setIsMenuOpen(false)}
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
      </div>
    </header>
  );
}
