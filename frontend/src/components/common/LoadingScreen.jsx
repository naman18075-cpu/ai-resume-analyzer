import { motion } from "framer-motion";

export function LoadingScreen({ label = "Loading workspace..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel flex w-full max-w-sm flex-col items-center gap-4 px-8 py-10 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-500/10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-300 border-t-brand-500" />
        </div>
        <div>
          <p className="text-lg font-semibold">AI Resume Analyzer</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </motion.div>
    </div>
  );
}
