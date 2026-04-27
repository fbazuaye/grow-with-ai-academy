import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

type Program = Database["public"]["Tables"]["programs"]["Row"];
type ProgramInsert = Database["public"]["Tables"]["programs"]["Insert"];

export const Route = createFileRoute("/admin/programs")({
  component: ProgramsAdmin,
});

const EMPTY: ProgramInsert = {
  slug: "",
  title: "",
  audience: "",
  outcome: "",
  duration: "",
  hero_headline: "",
  problem: "",
  learnings: [],
  tools: [],
  icon: "sparkles",
  featured: false,
  active: true,
  sort_order: 0,
};

function ProgramsAdmin() {
  const [rows, setRows] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("programs").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onNew = () => { setEditing(null); setOpen(true); };
  const onEdit = (p: Program) => { setEditing(p); setOpen(true); };

  const remove = async (id: string) => {
    if (!confirm("Delete this program? This also deletes its schedules and pricing.")) return;
    const { error } = await supabase.from("programs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((p) => p.id !== id));
    toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Programs</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} programs</p>
        </div>
        <Button variant="gold" onClick={onNew}><Plus className="mr-1 h-4 w-4" />New program</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No programs yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{p.title}</p>
                    {p.featured && <Star className="h-3.5 w-3.5 fill-accent text-accent" />}
                    {!p.active && <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">inactive</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">/{p.slug} · {p.audience} · {p.duration}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProgramDialog
        open={open}
        onOpenChange={setOpen}
        program={editing}
        onSaved={() => { setOpen(false); load(); }}
      />
    </div>
  );
}

function ProgramDialog({ open, onOpenChange, program, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; program: Program | null; onSaved: () => void }) {
  const [form, setForm] = useState<ProgramInsert>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (program) {
      setForm({
        slug: program.slug,
        title: program.title,
        audience: program.audience,
        outcome: program.outcome,
        duration: program.duration,
        hero_headline: program.hero_headline ?? "",
        problem: program.problem ?? "",
        learnings: program.learnings ?? [],
        tools: program.tools ?? [],
        icon: program.icon,
        featured: program.featured,
        active: program.active,
        sort_order: program.sort_order,
      });
    } else {
      setForm(EMPTY);
    }
  }, [program, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: ProgramInsert = {
      ...form,
      learnings: (form.learnings as string[]).map((s) => s.trim()).filter(Boolean),
      tools: (form.tools as string[]).map((s) => s.trim()).filter(Boolean),
    };
    const res = program
      ? await supabase.from("programs").update(payload).eq("id", program.id)
      : await supabase.from("programs").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(program ? "Updated" : "Created");
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{program ? "Edit program" : "New program"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Title</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <Label>Audience</Label>
              <Input required value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} />
            </div>
            <div>
              <Label>Duration</Label>
              <Input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div>
              <Label>Icon</Label>
              <Input value={form.icon ?? ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="sparkles" />
            </div>
            <div>
              <Label>Sort order</Label>
              <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>Hero headline</Label>
            <Input value={form.hero_headline ?? ""} onChange={(e) => setForm({ ...form, hero_headline: e.target.value })} />
          </div>
          <div>
            <Label>Outcome</Label>
            <Textarea required rows={2} value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} />
          </div>
          <div>
            <Label>Problem</Label>
            <Textarea rows={2} value={form.problem ?? ""} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
          </div>
          <div>
            <Label>Learnings (one per line)</Label>
            <Textarea
              rows={4}
              value={(form.learnings as string[] | undefined)?.join("\n") ?? ""}
              onChange={(e) => setForm({ ...form, learnings: e.target.value.split("\n") })}
            />
          </div>
          <div>
            <Label>Tools (comma separated)</Label>
            <Input
              value={(form.tools as string[] | undefined)?.join(", ") ?? ""}
              onChange={(e) => setForm({ ...form, tools: e.target.value.split(",").map((s) => s.trim()) })}
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={!!form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.active !== false} onCheckedChange={(v) => setForm({ ...form, active: v })} /> Active
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" variant="gold" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
