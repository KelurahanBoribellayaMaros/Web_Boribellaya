import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
      >
        <LogOut className="size-4" />
        Keluar
      </button>
    </form>
  );
}
