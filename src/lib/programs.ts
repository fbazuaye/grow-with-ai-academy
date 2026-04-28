import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Program = Database["public"]["Tables"]["programs"]["Row"];
export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
export type PricingTier = Database["public"]["Tables"]["pricing_tiers"]["Row"];

// Use a stateless anon client for public reads so SSR never sends a stale
// user JWT (which causes "JWT expired" errors on cached published pages).
function getReadClient() {
  if (typeof window !== "undefined") return supabase;
  const url =
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined);
  const key =
    (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof process !== "undefined" ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined);
  return createClient<Database>(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

export async function fetchPrograms(opts: { activeOnly?: boolean } = {}) {
  const client = getReadClient();
  let q = client.from("programs").select("*").order("sort_order", { ascending: true });
  if (opts.activeOnly !== false) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchProgramBySlug(slug: string) {
  const client = getReadClient();
  const { data: program, error } = await client
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!program) return null;
  const [{ data: schedules }, { data: tiers }] = await Promise.all([
    client.from("schedules").select("*").eq("program_id", program.id).order("sort_order"),
    client.from("pricing_tiers").select("*").eq("program_id", program.id).order("sort_order"),
  ]);
  return { program, schedules: schedules ?? [], tiers: tiers ?? [] };
}
