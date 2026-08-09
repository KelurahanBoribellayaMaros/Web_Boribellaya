/**
 * Memvalidasi token Cloudflare Turnstile.
 * @param token Token yang dikirimkan oleh klien (widget Turnstile)
 * @returns true jika validasi berhasil (bukan bot), false jika gagal
 */
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY belum diatur. Validasi Turnstile dilewati.");
    return true; // Bypass jika key belum di-set di environment
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: formData,
      method: "POST",
    });

    const outcome = await result.json();
    return outcome.success;
  } catch (error) {
    console.error("Gagal memvalidasi Turnstile token:", error);
    return false;
  }
}
