import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL_FALLBACK = "https://example.supabase.co";
const SUPABASE_ANON_KEY_FALLBACK = "public-anon-key";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase env vars are missing. The UI will still render, but backend authentication and data features require VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(
  SUPABASE_URL ?? SUPABASE_URL_FALLBACK,
  SUPABASE_ANON_KEY ?? SUPABASE_ANON_KEY_FALLBACK
);
