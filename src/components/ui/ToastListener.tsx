"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export function ToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    const message = searchParams.get("toast");
    if (!message) return;

    const type = searchParams.get("toastType") === "error" ? "error" : "success";
    showToast(message, type);

    const params = new URLSearchParams(searchParams);
    params.delete("toast");
    params.delete("toastType");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, pathname, router, showToast]);

  return null;
}
