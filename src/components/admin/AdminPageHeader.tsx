import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AdminPageHeaderProps = {
  icon: LucideIcon;
  iconClass?: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  action?: {
    href: string;
    label: string;
    icon?: LucideIcon;
  };
};

export function AdminPageHeader({
  icon: Icon,
  iconClass = "bg-blue-100 text-[#003459]",
  title,
  description,
  backHref,
  backLabel,
  action,
}: AdminPageHeaderProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-gray-500">
        <ArrowLeft className="size-4" />
        <Link href="/admin" className="transition-colors hover:text-gray-700">
          Dashboard Admin
        </Link>
        {backHref && (
          <>
            <span className="text-gray-300">/</span>
            <Link
              href={backHref}
              className="transition-colors hover:text-gray-700"
            >
              {backLabel}
            </Link>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
          >
            <Icon className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {title}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        {action && (
          <Link
            href={action.href}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#003459] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            {action.icon && <action.icon className="size-4" />}
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
