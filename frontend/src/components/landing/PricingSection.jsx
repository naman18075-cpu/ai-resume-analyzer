import { Check } from "lucide-react";

import { pricing } from "../../data/marketing";
import { Button } from "../ui/Button";

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Pricing</p>
        <h2 className="mt-4 text-4xl font-semibold">Positioned like a real SaaS offering.</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Pricing is mock data, but the structure is ready for real subscription packaging.
        </p>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {pricing.map((plan) => (
          <div
            key={plan.tier}
            className={`panel p-6 ${plan.featured ? "ring-2 ring-brand-400/50" : ""}`}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">{plan.tier}</p>
            <div className="mt-5 flex items-end gap-2">
              <h3 className="text-5xl font-semibold">{plan.price}</h3>
              {plan.price !== "Custom" && <span className="pb-2 text-sm text-slate-500">/month</span>}
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-lime-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button className="mt-8 w-full" variant={plan.featured ? "primary" : "secondary"}>
              Choose {plan.tier}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
