import { Link, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar, dashboardNavigation } from "./Sidebar";

const contentMap = {
  "/app": {
    title: "Command Center",
    description: "Monitor ATS trends, recent uploads, and score movements across every analysis.",
  },
  "/app/analyze": {
    title: "Analyze Resume",
    description: "Upload a resume, paste a job description, and generate a detailed SaaS-style analysis report.",
  },
  "/app/history": {
    title: "Analysis History",
    description: "Review previous ATS reports, compare keyword gaps, and reopen a full candidate evaluation.",
  },
  "/app/templates": {
    title: "Resume Studio",
    description: "Preview polished resume templates, rewrite stronger bullets, and surface interview prep suggestions.",
  },
  "/app/profile": {
    title: "Profile",
    description: "Manage account details, review account status, and see how your analysis activity is trending.",
  },
  "/app/admin": {
    title: "Admin Console",
    description: "Track platform usage, user growth, and aggregate analysis activity across the product.",
  },
};

export function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const pageContent = contentMap[location.pathname] || contentMap["/app"];

  return (
    <div className="min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Sidebar isAdmin={user?.role === "admin"} />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <DashboardHeader title={pageContent.title} description={pageContent.description} />
          <div className="panel flex gap-3 overflow-x-auto p-3 lg:hidden">
            {dashboardNavigation.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-brand-500 text-white"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
