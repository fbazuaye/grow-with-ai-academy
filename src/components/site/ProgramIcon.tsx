import { TrendingUp, Briefcase, Sparkles, Rocket, Coins, type LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  briefcase: Briefcase,
  sparkles: Sparkles,
  rocket: Rocket,
  coins: Coins,
};

export function ProgramIcon({ name, className }: { name: string; className?: string }) {
  const I = map[name] ?? Sparkles;
  return <I className={className} />;
}
