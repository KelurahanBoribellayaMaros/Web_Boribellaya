import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export const PPID_BUCKET = "ppid-documents";
// Private bucket (not publicly readable) — holds citizen-submitted ID
// documents, so files are only ever accessed via short-lived signed URLs
// generated for admins, never a permanent public URL like PPID_BUCKET.
export const PERMOHONAN_BUCKET = "permohonan-berkas";
