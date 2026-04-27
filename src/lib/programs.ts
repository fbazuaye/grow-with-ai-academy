import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Program = Database["public"]["Tables"]["programs"]["Row"];
export type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
export type PricingTier = Database["public"]["Tables"]["pricing_tiers"]["Row"];

export async function fetchPrograms(opts: { activeOnly?: boolean } = {}) {
  let q = supabase.from("programs").select("*").order("sort_order", { ascending: true });
  if (opts.activeOnly !== false) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function fetchProgramBySlug(slug: string) {
  const { data: program, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!program) return null;
  const [{ data: schedules }, { data: tiers }] = await Promise.all([
    supabase.from("schedules").select("*").eq("program_id", program.id).order("sort_order"),
    supabase.from("pricing_tiers").select("*").eq("program_id", program.id).order("sort_order"),
  ]);
  return { program, schedules: schedules ?? [], tiers: tiers ?? [] };
}
