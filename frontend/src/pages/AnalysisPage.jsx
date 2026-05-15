import {
  ArrowDownToLine,
  BarChart3,
  ClipboardCheck,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "../components/common/EmptyState";
import { ScoreRing } from "../components/dashboard/ScoreRing";
import { UploadZone } from "../components/dashboard/UploadZone";
import { Button } from "../components/ui/Button";
import {
  createAnalysis,
  exportAnalysisPdf,
  uploadJobDescription,
  uploadResume,
} from "../services/analysis";

function InsightCard({ title, children }) {
  return (
    <div className="panel p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AnalysisPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobFile, setJobFile] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    companyName: "",
    text: "",
  });
  const [analysis, setAnalysis] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState("Awaiting upload");

  const chartData = useMemo(() => {
    if (!analysis) {
      return [];
    }
    return [
      { name: "Keyword", value: Math.round(analysis.score_breakdown.keyword_score) },
      { name: "Semantic", value: Math.round(analysis.score_breakdown.semantic_score) },
      { name: "Formatting", value: Math.round(analysis.score_breakdown.formatting_score) },
      { name: "Sections", value: Math.round(analysis.score_breakdown.section_score) },
      { name: "Impact", value: Math.round(analysis.score_breakdown.impact_score) },
    ];
  }, [analysis]);

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!resumeFile) {
      toast.error("Upload a PDF or DOCX resume first.");
      return;
    }
    if (!formValues.title.trim()) {
      toast.error("Add the target role title.");
      return;
    }
    if (!formValues.text.trim() && !jobFile) {
      toast.error("Paste a job description or upload a JD file.");
      return;
    }

    setSubmitting(true);
    try {
      setStage("Parsing resume");
      const resume = await uploadResume(resumeFile);

      setStage("Indexing job description");
      const jobDescription = await uploadJobDescription({
        title: formValues.title,
        companyName: formValues.companyName,
        text: formValues.text,
        file: jobFile,
      });

      setStage("Running ATS and AI analysis");
      const result = await createAnalysis({
        resume_id: resume.id,
        job_description_id: jobDescription.id,
        target_role: formValues.title,
        company_name: formValues.companyName,
      });

      setAnalysis(result);
      toast.success("Analysis generated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to run analysis.");
    } finally {
      setSubmitting(false);
      setStage("Ready");
    }
  };

  const handleExport = async () => {
    if (!analysis) {
      return;
    }
    try {
      const blob = await exportAnalysisPdf(analysis.id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${analysis.target_role.replace(/\s+/g, "-").toLowerCase()}-analysis.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Could not export PDF report.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <form onSubmit={handleAnalyze} className="panel space-y-5 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Analysis input</p>
          <h2 className="mt-3 text-2xl font-semibold">Upload resume and target role</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The engine blends keyword matching, semantic similarity, section scoring, and AI guidance.
          </p>
        </div>

        <UploadZone
          label="Resume upload"
          helper="Accepted formats: PDF and DOCX"
          file={resumeFile}
          accept={{ "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
          onDrop={setResumeFile}
        />

        <UploadZone
          label="Optional JD file"
          helper="TXT, MD, PDF, or DOCX job descriptions"
          file={jobFile}
          accept={{ "text/plain": [".txt", ".md"], "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
          onDrop={setJobFile}
        />

        <div>
          <label className="mb-2 block text-sm font-semibold">Target role</label>
          <input
            type="text"
            value={formValues.title}
            onChange={(event) => setFormValues((current) => ({ ...current, title: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="Senior Full-Stack Engineer"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Company name</label>
          <input
            type="text"
            value={formValues.companyName}
            onChange={(event) => setFormValues((current) => ({ ...current, companyName: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="Northstar Talent"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Paste job description</label>
          <textarea
            rows={10}
            value={formValues.text}
            onChange={(event) => setFormValues((current) => ({ ...current, text: event.target.value }))}
            className="w-full rounded-3xl border border-slate-200 bg-white/80 px-4 py-4 text-sm leading-7 dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="Paste the target job description here..."
          />
        </div>

        <div className="rounded-3xl border border-brand-500/15 bg-brand-500/10 p-4 text-sm text-slate-700 dark:text-slate-200">
          <p className="font-semibold">Current stage</p>
          <p className="mt-1">{submitting ? stage : "Ready to run analysis"}</p>
        </div>

        <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting}>
          <Sparkles size={16} />
          {submitting ? "Analyzing..." : "Generate Analysis"}
        </Button>
      </form>

      <div className="grid gap-6">
        {!analysis && !submitting && (
          <EmptyState
            title="Your analysis dashboard will appear here."
            description="Once the engine finishes, you’ll see ATS scoring, missing keywords, rewrite suggestions, resume section strength, role recommendations, and interview prep."
            action={
              <Link to="/app/history">
                <Button variant="secondary">Browse Previous Reports</Button>
              </Link>
            }
          />
        )}

        {submitting && (
          <div className="panel flex min-h-[420px] items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-2 border-brand-300 border-t-brand-500" />
              <p className="mt-6 text-xl font-semibold">{stage}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                We’re parsing the document, extracting skills, and generating a candidate-ready insight report.
              </p>
            </div>
          </div>
        )}

        {analysis && (
          <>
            <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
              <ScoreRing score={analysis.ats_score} />
              <div className="panel p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Analysis summary
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">{analysis.target_role}</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Resume strength: {analysis.resume_strength}
                    </p>
                  </div>
                  <Button variant="secondary" className="gap-2" onClick={handleExport}>
                    <ArrowDownToLine size={16} />
                    Export PDF
                  </Button>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {analysis.executive_summary}
                </p>

                <div className="mt-8 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="value" radius={[16, 16, 0, 0]} fill="#32bfff" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <InsightCard title="Matched skills">
                <div className="flex flex-wrap gap-3">
                  {analysis.matched_keywords.map((skill) => (
                    <span key={skill} className="rounded-full bg-lime-400/15 px-3 py-2 text-sm font-semibold text-lime-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </InsightCard>

              <InsightCard title="Missing keywords">
                <div className="flex flex-wrap gap-3">
                  {analysis.missing_keywords.map((skill) => (
                    <span key={skill} className="rounded-full bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-500">
                      {skill}
                    </span>
                  ))}
                </div>
              </InsightCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <InsightCard title="AI suggestions">
                <div className="space-y-4">
                  {analysis.improvement_suggestions.map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
                      {item}
                    </div>
                  ))}
                </div>
              </InsightCard>

              <InsightCard title="Interview questions">
                <div className="space-y-4">
                  {analysis.interview_questions.map((question) => (
                    <div key={question} className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
                      {question}
                    </div>
                  ))}
                </div>
              </InsightCard>

              <InsightCard title="Role recommendations">
                <div className="space-y-4">
                  {analysis.job_recommendations.map((item) => (
                    <div key={item.role} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{item.role}</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.why}</p>
                        </div>
                        <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-600">
                          {Math.round(item.match_score)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </InsightCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <InsightCard title="Weak bullets and rewrites">
                <div className="space-y-4">
                  {analysis.bullet_rewrites.map((item) => (
                    <div key={item.original} className="rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Original</p>
                      <p className="mt-2 text-sm">{item.original}</p>
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Rewrite</p>
                      <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-300">{item.rewrite}</p>
                    </div>
                  ))}
                </div>
              </InsightCard>

              <InsightCard title="Section scoring">
                <div className="space-y-4">
                  {Object.entries(analysis.section_scores).map(([section, score]) => (
                    <div key={section}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="capitalize">{section}</span>
                        <span className="font-semibold">{Math.round(score)}</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-lime-400"
                          style={{ width: `${Math.min(score, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </InsightCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <InsightCard title="Recommended certifications">
                <div className="space-y-3">
                  {analysis.recommended_certifications.length ? (
                    analysis.recommended_certifications.map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No urgent certification gaps surfaced for this role.
                    </p>
                  )}
                </div>
              </InsightCard>

              <InsightCard title="Quick next steps">
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                    <Target size={18} className="mt-0.5 text-brand-500" />
                    Tailor your summary and top three bullets around the strongest missing keywords first.
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                    <ClipboardCheck size={18} className="mt-0.5 text-lime-500" />
                    Use the interview questions to rehearse deeper examples for the highlighted skill gaps.
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
                    <FileText size={18} className="mt-0.5 text-cyan-500" />
                    Head to Resume Studio to preview alternative resume layouts and reuse your rewritten bullets.
                  </div>
                </div>
                <div className="mt-5">
                  <Link to="/app/templates">
                    <Button variant="secondary" className="gap-2">
                      <BarChart3 size={16} />
                      Open Resume Studio
                    </Button>
                  </Link>
                </div>
              </InsightCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
