import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, Calendar, Tag, Inbox, LogOut, Sparkles, Globe } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — AI Mastery Academy" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/programs", label: "Programs", icon: BookOpen },
  { to: "/admin/schedules", label: "Schedules", icon: Calendar },
  { to: "/admin/pricing", label: "Pricing", icon: Tag },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/visitors", label: "Visitors", icon: Globe },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null && isAdmin === null) return;
    if (!session) {
      navigate({ to: "/auth" });
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) {
        toast.error("Could not verify admin role.");
        setIsAdmin(false);
        return;
      }
      setIsAdmin(!!data);
    })();
  }, [session, navigate, isAdmin]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (!session || isAdmin === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Checking access…</div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="font-display text-2xl">Not authorised</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account ({session.user.email}) does not have admin access. Ask an existing admin to grant you the role, or run a one-time SQL insert into <code>user_roles</code>.
        </p>
        <p className="mt-2 break-all rounded-md bg-muted p-2 text-xs text-muted-foreground">
          Your user ID: {session.user.id}
        </p>
        <Button variant="outline" className="mt-4" onClick={handleSignOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
      <aside className="space-y-1 md:sticky md:top-20 md:self-start">
        <div className="mb-3 flex items-center gap-2 px-2 text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-gold shadow-gold">
            <Sparkles className="h-4 w-4 text-navy" />
          </span>
          <div>
            <p className="font-semibold leading-tight">Admin</p>
            <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to as "/admin"}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <Button variant="ghost" size="sm" className="mt-4 w-full justify-start text-muted-foreground" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
