import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

type Program = Database["public"]["Tables"]["programs"]["Row"];
type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
type ScheduleInsert = Database["public"]["Tables"]["schedules"]["Insert"];

export const Route = createFileRoute("/admin/schedules")({
  component: SchedulesAdmin,
});

const empty = (programId: string): ScheduleInsert => ({
  program_id: programId,
  batch_label: "",
  start_date: new Date().toISOString().slice(0, 10),
  end_date: new Date().toISOString().slice(0, 10),
  time_text: "",
  format: "online",
  status: "open",
  seats: null,
  sort_order: 0,
});

function SchedulesAdmin() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [rows, setRows] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [programFilter, setProgramFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("programs").select("*").order("sort_order"),
      supabase.from("schedules").select("*").order("start_date", { ascending: true }),
    ]);
    setPrograms(p ?? []);
    setRows(s ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this batch?")) return;
    const { error } = await supabase.from("schedules").delete().eq("id", id);
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
          <h1 className="font-display text-3xl">Schedules</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} batches across {programs.length} programs</p>
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
            <Plus className="mr-1 h-4 w-4" />New batch
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No batches.</p>
        ) : (
          <div className="divide-y divide-border">
            {visible.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold">{s.batch_label}</p>
                  <p className="text-xs text-muted-foreground">
                    {programTitle(s.program_id)} · {format(parseISO(s.start_date), "PP")} → {format(parseISO(s.end_date), "PP")} · {s.format} · {s.status}
                    {s.seats != null && ` · ${s.seats} seats`}
                  </p>
                  {s.time_text && <p className="text-xs text-muted-foreground">{s.time_text}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ScheduleDialog
        open={open}
        onOpenChange={setOpen}
        programs={programs}
        schedule={editing}
        onSaved={() => { setOpen(false); load(); }}
      />
    </div>
  );
}

function ScheduleDialog({ open, onOpenChange, programs, schedule, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; programs: Program[]; schedule: Schedule | null; onSaved: () => void }) {
  const [form, setForm] = useState<ScheduleInsert>(empty(programs[0]?.id ?? ""));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule) {
      setForm({ ...schedule });
    } else {
      setForm(empty(programs[0]?.id ?? ""));
    }
  }, [schedule, open, programs]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = schedule
      ? await supabase.from("schedules").update(form).eq("id", schedule.id)
      : await supabase.from("schedules").insert(form);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(schedule ? "Updated" : "Created");
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{schedule ? "Edit batch" : "New batch"}</DialogTitle>
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
          <div>
            <Label>Batch label</Label>
            <Input required value={form.batch_label} onChange={(e) => setForm({ ...form, batch_label: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Start date</Label>
              <Input required type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <Label>End date</Label>
              <Input required type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Time / cadence</Label>
            <Input value={form.time_text} onChange={(e) => setForm({ ...form, time_text: e.target.value })} placeholder="Sat & Sun, 10am–2pm WAT" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Format</Label>
              <Select value={form.format ?? "online"} onValueChange={(v) => setForm({ ...form, format: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in_person">In person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status ?? "open"} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="filling">Filling fast</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Seats</Label>
              <Input type="number" value={form.seats ?? ""} onChange={(e) => setForm({ ...form, seats: e.target.value === "" ? null : Number(e.target.value) })} />
            </div>
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
