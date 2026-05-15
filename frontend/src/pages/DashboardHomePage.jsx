import { Activity, BadgeCheck, BriefcaseBusiness, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "../components/common/EmptyState";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { StatCard } from "../components/dashboard/StatCard";
import { Button } from "../components/ui/Button";
import { getDashboardOverview } from "../services/dashboard";

export default function DashboardHomePage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await getDashboardOverview();
        setOverview(data);
      } catch (error) {
        toast.error("Could not load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-6 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} className="h-40 rounded-3xl" />
          ))}
        </div>
        <SkeletonCard className="h-[380px] rounded-3xl" />
      </div>
    );
  }

  if (!overview?.total_analyses) {
    return (
      <EmptyState
        title="Your dashboard is ready for its first analysis."
        description="Upload a resume and a target job description to generate ATS scoring, skill gaps, and AI recommendations."
        action={
          <Link to="/app/analyze">
            <Button>Run First Analysis</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Total analyses"
          value={overview.total_analyses}
          helper="All-time analyses in your workspace"
          accent="bg-brand-500/10 text-brand-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Average ATS"
          value={Math.round(overview.average_ats_score)}
          helper="Average performance across roles"
          accent="bg-lime-400/10 text-lime-500"
        />
        <StatCard
          icon={BadgeCheck}
          label="Top score"
          value={Math.round(overview.top_score)}
          helper="Best ATS fit achieved so far"
          accent="bg-cyan-400/10 text-cyan-500"
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Skill gaps"
          value={overview.skill_gap_count}
          helper="Distinct missing skills surfaced"
          accent="bg-slate-900/10 text-slate-800 dark:bg-white/10 dark:text-white"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Score trend
              </p>
              <h3 className="mt-2 text-2xl font-semibold">ATS performance over time</h3>
            </div>
            <Link to="/app/history">
              <Button variant="secondary">View History</Button>
            </Link>
          </div>

          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.score_trend}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#32bfff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#32bfff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#32bfff" fill="url(#scoreFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Favorite skills
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {overview.favorite_skills.map((skill) => (
                <span key={skill} className="rounded-full bg-brand-500/10 px-3 py-2 text-sm font-semibold text-brand-600">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
              Recent analyses
            </p>
            <div className="mt-5 space-y-4">
              {overview.recent_analyses.map((analysis) => (
                <div key={analysis.id} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{analysis.target_role}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{analysis.job_description_title}</p>
                    </div>
                    <span className="rounded-full bg-lime-400/15 px-3 py-1 text-sm font-semibold text-lime-600">
                      {Math.round(analysis.ats_score)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
