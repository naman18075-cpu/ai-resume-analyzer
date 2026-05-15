import { motion } from "framer-motion";

export function StatCard({ icon: Icon, label, value, accent, helper }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-4 text-4xl font-semibold">{value}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
