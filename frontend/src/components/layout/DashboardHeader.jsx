import { Bell, LogOut } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../ui/Button";

export function DashboardHeader({ title, description }) {
  const { logout, user } = useAuth();

  return (
    <header className="panel flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70">
          <Bell size={18} />
        </button>
        <ThemeToggle />
        <div className="hidden rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/70 md:block">
          <p className="font-semibold">{user?.full_name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
        <Button variant="secondary" className="gap-2" onClick={logout}>
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
}
