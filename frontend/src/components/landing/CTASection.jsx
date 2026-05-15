import { Link } from "react-router-dom";

import { Button } from "../ui/Button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="panel overflow-hidden p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Ready to ship</p>
            <h2 className="mt-4 text-4xl font-semibold">Launch a portfolio-worthy AI product, not another generic dashboard.</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Built for consultants, recruiters, founders, and developers who need a polished AI app with real business value.
            </p>
          </div>
          <Link to="/signup">
            <Button size="lg">Create Your Workspace</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
