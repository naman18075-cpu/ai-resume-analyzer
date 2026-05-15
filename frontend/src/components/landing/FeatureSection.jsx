import { motion } from "framer-motion";

import { features } from "../../data/marketing";

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Feature stack</p>
        <h2 className="mt-4 text-4xl font-semibold">Everything needed for a portfolio-worthy AI hiring product.</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Clean UX, scalable architecture, and a feature set that feels client-ready instead of demo-only.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="panel p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                <Icon size={22} />
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
