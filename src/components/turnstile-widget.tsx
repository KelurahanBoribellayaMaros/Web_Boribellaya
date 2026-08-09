"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useState } from "react";

interface TurnstileWidgetProps {
  onVerify?: (token: string) => void;
  className?: string;
}

export function TurnstileWidget({ onVerify, className }: TurnstileWidgetProps) {
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    // Gunakan test key dari Cloudflare jika env var tidak di-set
    const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
    setSiteKey(key);
  }, []);

  if (!siteKey) return null;

  return (
    <div className={`mt-4 ${className || ""}`}>
      <Turnstile
        siteKey={siteKey}
        onSuccess={onVerify}
        onError={() => console.error("Turnstile error")}
        options={{
          theme: "light",
          size: "normal",
        }}
      />
    </div>
  );
}
