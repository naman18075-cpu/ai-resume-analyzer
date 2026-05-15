import { cn } from "../../utils/cn";

export function HistoryTable({ items, selectedId, onSelect }) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/60 dark:bg-slate-900/60">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Resume</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Missing</th>
              <th className="px-5 py-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={cn(
                  "cursor-pointer border-t border-slate-200/70 transition hover:bg-brand-500/5 dark:border-slate-800",
                  selectedId === item.id && "bg-brand-500/10"
                )}
              >
                <td className="px-5 py-4">
                  <p className="font-semibold">{item.target_role}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.company_name || "Independent target"}</p>
                </td>
                <td className="px-5 py-4 text-sm">{item.resume_name}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-600">
                    {Math.round(item.ats_score)}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {item.missing_keywords.slice(0, 3).join(", ") || "None"}
                </td>
                <td className="px-5 py-4 text-sm">
                  {new Date(item.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
