import { headers } from "next/headers";
import { adminDb } from "@/lib/firebase/admin";

interface RateLimitData {
  count: number;
  resetAt: number;
}

/**
 * Memeriksa apakah akses melebihi batas rate limit.
 * Menggunakan Firebase Firestore sebagai penyimpanan sementara.
 * 
 * @param key Kunci unik rate limit (misal: "login:IP" atau "submit:email")
 * @param maxRequests Maksimal percobaan yang diizinkan dalam satu jendela waktu
 * @param windowMs Durasi jendela waktu dalam milidetik
 * @returns true jika diizinkan, false jika melebihi batas
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  const ref = adminDb.collection("rate_limits").doc(key);

  try {
    const result = await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      const now = Date.now();

      if (!doc.exists) {
        transaction.set(ref, {
          count: 1,
          resetAt: now + windowMs,
        });
        return true;
      }

      const data = doc.data() as RateLimitData;
      
      // Jika waktu reset sudah lewat, mulai ulang dari 1
      if (now > data.resetAt) {
        transaction.set(ref, {
          count: 1,
          resetAt: now + windowMs,
        });
        return true;
      }

      // Jika masih dalam jendela waktu, cek jumlah
      if (data.count >= maxRequests) {
        return false;
      }

      // Increment count
      transaction.update(ref, {
        count: data.count + 1,
      });
      return true;
    });

    return result;
  } catch (error) {
    console.error("Rate limiter transaction failed:", error);
    // Fallback: allow the request if the rate limiter fails, so we don't block legitimate users
    return true; 
  }
}

/**
 * Mengambil alamat IP pengguna dari headers.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown-ip";
}
