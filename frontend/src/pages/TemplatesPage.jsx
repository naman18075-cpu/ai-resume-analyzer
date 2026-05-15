import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { EmptyState } from "../components/common/EmptyState";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { TemplatePreview } from "../components/dashboard/TemplatePreview";
import { Button } from "../components/ui/Button";
import { getAnalysis, listAnalyses } from "../services/analysis";

export default function TemplatesPage() {
  const [analysis, setAnalysis] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("executive");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const history = await listAnalyses();
        if (history[0]) {
          const detail = await getAnalysis(history[0].id);
          setAnalysis(detail);
        }
      } catch (error) {
        toast.error("Could not load resume studio.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <SkeletonCard className="h-[720px] rounded-3xl" />;
  }

  if (!analysis) {
    return (
      <EmptyState
        title="Run an analysis to unlock resume previews."
        description="Resume Studio uses your latest analysis data to preview polished layouts and AI-powered rewrite suggestions."
        action={
          <Link to="/app/analyze">
            <Button>Go to Analyze</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6">
      <TemplatePreview analysis={analysis} selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-6">
          <h3 className="text-2xl font-semibold">AI-generated bullet rewrites</h3>
          <div className="mt-5 space-y-4">
            {analysis.bullet_rewrites.map((item) => (
              <div key={item.original} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Original</p>
                <p className="mt-2 text-sm">{item.original}</p>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Rewrite</p>
                <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-300">{item.rewrite}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="panel p-6">
            <h3 className="text-2xl font-semibold">Recommended certifications</h3>
            <div className="mt-5 space-y-3">
              {analysis.recommended_certifications.length ? (
                analysis.recommended_certifications.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your current resume already aligns well enough that no urgent certifications stand out.
                </p>
              )}
            </div>
          </div>
          <div className="panel p-6">
            <h3 className="text-2xl font-semibold">Interview question generator</h3>
            <div className="mt-5 space-y-3">
              {analysis.interview_questions.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
