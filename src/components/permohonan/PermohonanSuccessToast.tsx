"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export function PermohonanSuccessToast() {
  const { showToast } = useToast();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    showToast("Permohonan Berhasil Dikirim!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
