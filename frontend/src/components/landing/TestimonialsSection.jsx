import { motion } from "framer-motion";

import { testimonials } from "../../data/marketing";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-y border-slate-200/70 bg-white/40 py-20 dark:border-slate-800 dark:bg-slate-900/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Testimonials</p>
          <h2 className="mt-4 text-4xl font-semibold">Built to impress clients, coaches, and startup teams.</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="panel p-6"
            >
              <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">“{item.quote}”</p>
              <div className="mt-8">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
