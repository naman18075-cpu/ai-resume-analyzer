import { ShieldCheck, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "../common/ThemeToggle";

const highlights = [
  "Upload PDF or DOCX resumes with drag-and-drop UX",
  "Compare candidates against target job descriptions",
  "Generate AI suggestions, ATS insights, and exportable reports",
];

export function AuthShell({ title, description, footer, children }) {
  return (
    <div className="min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel flex flex-col justify-between overflow-hidden p-8 lg:p-10">
          <div>
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-bold text-white">
                  AI
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">Resume Analyzer</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Premium AI hiring intelligence
                  </p>
                </div>
              </Link>
              <ThemeToggle />
            </div>

            <div className="mt-20">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
                <Sparkles size={14} />
                Fast-track job fit analysis
              </p>
              <h1 className="mt-6 max-w-xl text-5xl leading-tight">{title}</h1>
              <p className="mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-300">{description}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-brand-500/15 bg-brand-500/10 p-4">
                <Target className="text-brand-500" size={20} />
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">Score job match in seconds</p>
              </div>
              <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 p-4">
                <ShieldCheck className="text-lime-500" size={20} />
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">JWT-secured workflow</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <Sparkles className="text-brand-500" size={20} />
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">OpenAI-powered suggestions</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/60 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                What you unlock
              </p>
              <div className="mt-4 space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            {children}
            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
