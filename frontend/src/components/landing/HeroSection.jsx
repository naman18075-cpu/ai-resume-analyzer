import { ArrowRight, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Button } from "../ui/Button";

const metrics = [
  { label: "Average ATS lift", value: "+21%" },
  { label: "Analyses generated", value: "12k+" },
  { label: "Time saved", value: "8.4h/week" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-200">
            <Sparkles size={14} />
            AI-powered career intelligence
          </div>
          <h1 className="max-w-3xl text-5xl leading-tight text-slate-950 dark:text-white md:text-6xl">
            Turn every resume into a startup-grade candidate intelligence dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Upload a resume, compare it against a target job description, and get ATS scoring, skill gaps,
            bullet rewrites, and interview prep in one premium workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Launch App
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="secondary">
                Explore Features
              </Button>
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <div className="panel-soft flex items-center gap-3 px-4 py-3 text-sm">
              <ShieldCheck size={16} className="text-lime-400" />
              JWT auth, file validation, rate limiting
            </div>
            <div className="panel-soft flex items-center gap-3 px-4 py-3 text-sm">
              <BrainCircuit size={16} className="text-brand-500" />
              OpenAI + semantic matching + resume scoring
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="panel grid-overlay relative overflow-hidden p-6"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-cyan-300 to-lime-400" />
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">ATS Match</p>
                  <p className="mt-2 text-5xl font-semibold">87</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Top gaps</p>
                  <p className="mt-2 text-sm">Kubernetes, Prompt Engineering, Terraform</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="panel-soft px-4 py-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-brand-500/20 bg-brand-500/10 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-700 dark:text-brand-200">
                  Rewrite Suggestions
                </p>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                  Replace vague bullets with quantified outcomes tied to ownership, tools, and business impact.
                </p>
              </div>
              <div className="rounded-3xl border border-lime-400/20 bg-lime-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-lime-700 dark:text-lime-300">
                  Interview Prep
                </p>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                  Generate tailored technical and behavioral questions from the target role and skill gaps.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
