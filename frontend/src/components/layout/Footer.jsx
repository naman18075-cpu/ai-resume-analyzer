export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 py-10 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-sm text-slate-500 dark:text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">AI Resume Analyzer</p>
          <p className="mt-1">AI-powered ATS scoring, skill intelligence, and premium resume strategy.</p>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="transition hover:text-brand-500">
            Features
          </a>
          <a href="#pricing" className="transition hover:text-brand-500">
            Pricing
          </a>
          <a href="#testimonials" className="transition hover:text-brand-500">
            Testimonials
          </a>
        </div>
      </div>
    </footer>
  );
}
