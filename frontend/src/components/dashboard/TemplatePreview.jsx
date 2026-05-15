import { cn } from "../../utils/cn";

const templates = [
  { id: "executive", label: "Executive Grid" },
  { id: "minimal", label: "Minimal Clean" },
  { id: "bold", label: "Bold Sidebar" },
];

export function TemplatePreview({ analysis, selectedTemplate, onSelect }) {
  const sections = analysis?.resume?.parsed_sections || {};
  const topSkills = analysis?.resume?.skills?.slice(0, 8) || [];

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <div className="panel p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Templates
        </p>
        <div className="mt-4 space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={cn(
                "w-full rounded-2xl border px-4 py-4 text-left transition",
                selectedTemplate === template.id
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-slate-200 bg-white/70 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-800"
              )}
            >
              <p className="font-semibold">{template.label}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Optimized for clarity, keyword visibility, and modern presentation.
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="panel overflow-hidden p-8">
        <div
          className={cn(
            "min-h-[560px] rounded-[2rem] border border-slate-200/70 bg-white p-8 text-slate-900 shadow-inner",
            selectedTemplate === "executive" && "grid gap-8 lg:grid-cols-[1fr_280px]",
            selectedTemplate === "minimal" && "space-y-8",
            selectedTemplate === "bold" && "grid gap-8 lg:grid-cols-[240px_1fr]"
          )}
        >
          {(selectedTemplate === "executive" || selectedTemplate === "bold") && (
            <div className={cn(selectedTemplate === "bold" && "rounded-[1.5rem] bg-slate-950 p-6 text-white")}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">
                Core skills
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {topSkills.map((skill) => (
                  <span
                    key={skill}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      selectedTemplate === "bold"
                        ? "bg-white/10 text-white"
                        : "bg-brand-500/10 text-brand-600"
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Summary</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {sections.summary || analysis?.executive_summary}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Experience</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{sections.experience || "Experience content unavailable."}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Projects</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{sections.projects || "Projects section unavailable."}</p>
            </div>
            {selectedTemplate === "minimal" && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
