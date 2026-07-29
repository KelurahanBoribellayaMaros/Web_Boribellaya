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
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Ubah Kredensial
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Perbarui email atau kata sandi akun Anda.
        </p>
      </div>

      <div className="mt-8">
        <CredentialsForm currentEmail={session.email ?? ""} />
      </div>
    </div>
  );
}
