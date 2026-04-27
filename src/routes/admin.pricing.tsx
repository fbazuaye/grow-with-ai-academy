import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

type Program = Database["public"]["Tables"]["programs"]["Row"];
type Tier = Database["public"]["Tables"]["pricing_tiers"]["Row"];
type TierInsert = Database["public"]["Tables"]["pricing_tiers"]["Insert"];

export const Route = createFileRoute("/admin/pricing")({
  component: PricingAdmin,
});

const empty = (programId: string): TierInsert => ({
  program_id: programId,
  name: "",
  price_label: "",
  price_amount: null,
  currency: "NGN",
  features: [],
  popular: false,
  sort_order: 0,
});

function PricingAdmin() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [rows, setRows] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tier | null>(null);
  const [programFilter, setProgramFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: t }] = await Promise.all([
      supabase.from("programs").select("*").order("sort_order"),
      supabase.from("pricing_tiers").select("*").order("sort_order"),
    ]);
    setPrograms(p ?? []);
    setRows(t ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this pricing tier?")) return;
    const { error } = await supabase.from("pricing_tiers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  const programTitle = (id: string) => programs.find((p) => p.id === id)?.title ?? "—";
  const visible = rows.filter((r) => programFilter === "all" || r.program_id === programFilter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Pricing</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} tiers</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filter program" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All programs</SelectItem>
              {programs.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="gold" onClick={() => { setEditing(null); setOpen(true); }} disabled={programs.length === 0}>
            <Plus className="mr-1 h-4 w-4" />New tier
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No tiers.</p>
        ) : (
          <div className="divide-y divide-border">
            {visible.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{t.name}</p>
                    {t.popular && <Star className="h-3.5 w-3.5 fill-accent text-accent" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {programTitle(t.program_id)} · {t.price_label}
                    {t.price_amount != null && ` · ${t.currency} ${t.price_amount}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{(t.features ?? []).length} features</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TierDialog
        open={open}
        onOpenChange={setOpen}
        programs={programs}
        tier={editing}
        onSaved={() => { setOpen(false); load(); }}
      />
    </div>
  );
}

function TierDialog({ open, onOpenChange, programs, tier, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; programs: Program[]; tier: Tier | null; onSaved: () => void }) {
  const [form, setForm] = useState<TierInsert>(empty(programs[0]?.id ?? ""));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tier) setForm({ ...tier });
    else setForm(empty(programs[0]?.id ?? ""));
  }, [tier, open, programs]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: TierInsert = {
      ...form,
      features: (form.features as string[] | undefined ?? []).map((s) => s.trim()).filter(Boolean),
    };
    const res = tier
      ? await supabase.from("pricing_tiers").update(payload).eq("id", tier.id)
      : await supabase.from("pricing_tiers").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(tier ? "Updated" : "Created");
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{tier ? "Edit pricing tier" : "New pricing tier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Program</Label>
            <Select value={form.program_id} onValueChange={(v) => setForm({ ...form, program_id: v })}>
              <SelectTrigger><SelectValue placeholder="Choose program" /></SelectTrigger>
              <SelectContent>
                {programs.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Tier name</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Price label</Label>
              <Input required value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} placeholder="₦150,000" />
            </div>
            <div>
              <Label>Price amount</Label>
              <Input type="number" value={form.price_amount ?? ""} onChange={(e) => setForm({ ...form, price_amount: e.target.value === "" ? null : Number(e.target.value) })} />
            </div>
            <div>
              <Label>Currency</Label>
              <Input value={form.currency ?? "NGN"} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea
              rows={5}
              value={(form.features as string[] | undefined)?.join("\n") ?? ""}
              onChange={(e) => setForm({ ...form, features: e.target.value.split("\n") })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={!!form.popular} onCheckedChange={(v) => setForm({ ...form, popular: v })} /> Mark as popular
          </label>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
