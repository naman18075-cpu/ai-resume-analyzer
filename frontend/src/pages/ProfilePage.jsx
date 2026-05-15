import { BriefcaseBusiness, CalendarRange, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { EmptyState } from "../components/common/EmptyState";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { StatCard } from "../components/dashboard/StatCard";
import { useAuth } from "../hooks/useAuth";
import { getDashboardOverview } from "../services/dashboard";

export default function ProfilePage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardOverview();
        setOverview(data);
      } catch (error) {
        setFailed(true);
        toast.error("Could not load profile metrics.");
      }
    };

    load();
  }, []);

  if (!overview) {
    if (failed) {
      return (
        <EmptyState
          title="Profile metrics are temporarily unavailable."
          description="Your account is still active, but the analytics summary could not be loaded in this session."
        />
      );
    }
    return <SkeletonCard className="h-[520px] rounded-3xl" />;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <StatCard
          icon={BriefcaseBusiness}
          label="Analyses completed"
          value={overview.total_analyses}
          helper="Total ATS reports created"
          accent="bg-brand-500/10 text-brand-600"
        />
        <StatCard
          icon={CalendarRange}
          label="Current streak"
          value={overview.current_streak}
          helper="Consecutive active analysis days"
          accent="bg-lime-400/10 text-lime-500"
        />
        <StatCard
          icon={ShieldCheck}
          label="Account role"
          value={user?.role === "admin" ? "Admin" : "User"}
          helper="Permission level for this workspace"
          accent="bg-cyan-400/10 text-cyan-500"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Account overview
          </p>
          <div className="mt-6 flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-500/10 text-brand-600">
              <UserRound size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold">{user?.full_name}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Security posture
          </p>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
              JWT-authenticated session handling
            </div>
            <div className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
              Protected routes for analysis and admin access
            </div>
            <div className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
              File type validation, rate limiting, and environment-based secrets
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
