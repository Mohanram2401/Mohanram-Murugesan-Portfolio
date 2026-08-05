import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// Graceful fallback for local development if keys are not configured yet
export const supabase = createClient(
  supabaseUrl && !supabaseUrl.includes("your-project-id") ? supabaseUrl : "https://placeholder-project.supabase.co",
  supabaseAnonKey && !supabaseAnonKey.includes("your-anon-key-here") ? supabaseAnonKey : "placeholder-key"
);
