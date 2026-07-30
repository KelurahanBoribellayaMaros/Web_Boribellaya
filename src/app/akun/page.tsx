import type { Metadata } from "next";
import { requireSession } from "@/lib/firebase/session";
import { CredentialsForm } from "@/components/akun/CredentialsForm";

export const metadata: Metadata = {
  title: "Ubah Kredensial | Kelurahan Boribellaya",
};

export default async function AkunPage() {
  const session = await requireSession();

  return (
    <div className="mx-auto max-w-md px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-8 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#2b9348]" />
          <span className="text-xs font-semibold tracking-widest text-[#2b9348] uppercase">
            Pengaturan Akun
          </span>
          <span className="h-px w-8 bg-[#2b9348]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Ubah Kredensial
        </h1>
        <p className="mt-2 text-sm text-white/80 sm:text-base">
          Perbarui email atau kata sandi akun Anda.
        </p>
      </div>

      <div className="mt-8">
        <CredentialsForm currentEmail={session.email ?? ""} />
      </div>
    </div>
  );
}
