import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { MessageCircle, Mail, Trash2 } from "lucide-react";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "contacted">("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success("Updated");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  const visible = rows.filter((r) => filter === "all" || r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Enquiries</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} total · {rows.filter((r) => r.status === "new").length} new</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1 text-sm">
          {(["all", "new", "contacted"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 capitalize ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {visible.map((e) => (
              <div key={e.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{e.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${e.status === "new" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                        {e.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {e.program_title ?? "General enquiry"} · {format(parseISO(e.created_at), "PP p")}
                    </p>
                    <p className="mt-2 text-sm">
                      <a className="hover:text-accent" href={`mailto:${e.email}`}>{e.email}</a>
                      {" · "}
                      <a className="hover:text-accent" href={`tel:${e.phone}`}>{e.phone}</a>
                    </p>
                    {e.preferred_date && <p className="mt-1 text-xs text-muted-foreground">Preferred: {e.preferred_date}</p>}
                    {e.message && <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm">{e.message}</p>}
                  </div>
                  <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                    <a href={`https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline"><MessageCircle className="mr-1 h-4 w-4" />WhatsApp</Button>
                    </a>
                    <a href={`mailto:${e.email}`}>
                      <Button size="sm" variant="outline"><Mail className="mr-1 h-4 w-4" />Email</Button>
                    </a>
                    {e.status === "new" ? (
                      <Button size="sm" variant="gold" onClick={() => setStatus(e.id, "contacted")}>Mark contacted</Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(e.id, "new")}>Mark new</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => remove(e.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
