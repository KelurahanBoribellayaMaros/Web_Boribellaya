import type { OrgPosition } from "@/lib/firebase/struktur-repository";

type OrgPositionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Pick<OrgPosition, "name" | "position" | "order">;
  submitLabel: string;
};

export function OrgPositionForm({
  action,
  defaultValues,
  submitLabel,
}: OrgPositionFormProps) {
  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div>
        <label
          htmlFor="position"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Jabatan
        </label>
        <input
          id="position"
          name="position"
          type="text"
          required
          defaultValue={defaultValues?.position}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
      </div>

      <div>
        <label htmlFor="order" className="mb-1.5 block text-sm font-medium text-gray-700">
          Urutan Tampil
        </label>
        <input
          id="order"
          name="order"
          type="number"
          min={0}
          required
          defaultValue={defaultValues?.order ?? 0}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Angka lebih kecil tampil lebih dulu di bagan struktur.
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-green-800 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}
