import { Activity, BarChart3, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SkeletonCard } from "../components/common/SkeletonCard";
import { StatCard } from "../components/dashboard/StatCard";
import { EmptyState } from "../components/common/EmptyState";
import { getAdminOverview } from "../services/admin";

export default function AdminPage() {
  const [overview, setOverview] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAdminOverview();
        setOverview(data);
      } catch (error) {
        setFailed(true);
        toast.error("Could not load admin overview.");
      }
    };

    load();
  }, []);

  if (!overview) {
    if (failed) {
      return (
        <EmptyState
          title="Admin analytics are temporarily unavailable."
          description="The admin route is protected correctly, but the analytics payload could not be loaded right now."
        />
      );
    }
    return <SkeletonCard className="h-[720px] rounded-3xl" />;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-4">
        <StatCard
          icon={UsersRound}
          label="Total users"
          value={overview.total_users}
          helper="Registered workspace accounts"
          accent="bg-brand-500/10 text-brand-600"
        />
        <StatCard
          icon={BarChart3}
          label="Total analyses"
          value={overview.total_analyses}
          helper="Reports generated across the platform"
          accent="bg-lime-400/10 text-lime-500"
        />
        <StatCard
          icon={Activity}
          label="Active users"
          value={overview.active_users_30d}
          helper="Users with activity in the last 30 days"
          accent="bg-cyan-400/10 text-cyan-500"
        />
        <StatCard
          icon={Activity}
          label="API requests"
          value={overview.api_requests_7d}
          helper="Requests tracked during the last week"
          accent="bg-slate-900/10 text-slate-800 dark:bg-white/10 dark:text-white"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel p-6">
          <h3 className="text-2xl font-semibold">API usage trend</h3>
          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.daily_usage}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" radius={[14, 14, 0, 0]} fill="#32bfff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel p-6">
            <h3 className="text-2xl font-semibold">Role distribution</h3>
            <div className="mt-5 space-y-3">
              {overview.role_distribution.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-lime-400"
                      style={{ width: `${(item.value / Math.max(overview.total_users, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="text-2xl font-semibold">Recent signups</h3>
            <div className="mt-5 space-y-4">
              {overview.recent_signups.map((user) => (
                <div key={user.email} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                  <p className="font-semibold">{user.full_name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{user.created_at}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
