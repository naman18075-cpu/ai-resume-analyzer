import { motion } from "framer-motion";

export function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel-soft flex flex-col items-start gap-4 p-8"
    >
      <div className="rounded-2xl bg-brand-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">
        Empty state
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {action}
    </motion.div>
  );
}
