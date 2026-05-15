import {
  BarChart3,
  FileBarChart2,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "../../utils/cn";

export const dashboardNavigation = [
  { label: "Overview", href: "/app", icon: LayoutDashboard },
  { label: "Analyze", href: "/app/analyze", icon: Sparkles },
  { label: "History", href: "/app/history", icon: FileBarChart2 },
  { label: "Templates", href: "/app/templates", icon: BarChart3 },
  { label: "Profile", href: "/app/profile", icon: UserCircle2 },
];

export function Sidebar({ isAdmin }) {
  const location = useLocation();

  return (
    <aside className="panel hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col p-6 lg:flex">
      <div className="mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-lg font-bold text-white">
          AI
        </div>
        <h2 className="mt-4 text-2xl font-semibold">Resume OS</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          AI-led job fit analysis with a premium candidate dashboard.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {dashboardNavigation.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            to="/app/admin"
            className={cn(
              "mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              location.pathname === "/app/admin"
                ? "bg-lime-400 text-slate-950"
                : "border border-lime-400/40 bg-lime-400/10 text-lime-700 hover:bg-lime-400/15 dark:text-lime-300"
            )}
          >
            <ShieldCheck size={18} />
            Admin Console
          </Link>
        )}
      </nav>

      <div className="rounded-3xl border border-brand-500/20 bg-brand-500/8 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Upgrade Flow</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Export polished PDF reports and showcase score improvements over time.
        </p>
      </div>
    </aside>
  );
}
