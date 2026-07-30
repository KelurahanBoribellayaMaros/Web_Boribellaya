import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ProfileCardProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  variant?: "green" | "blue";
};

export function ProfileCard({
  icon: Icon,
  title,
  children,
  variant = "green",
}: ProfileCardProps) {
  const iconClass =
    variant === "blue" ? "bg-blue-100 text-[#003459]" : "bg-green-100 text-green-700";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
        >
          <Icon className="size-5" />
        </span>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
