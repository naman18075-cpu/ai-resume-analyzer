import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { ThemeToggle } from "../common/ThemeToggle";
import { Button } from "../ui/Button";

export function MarketingNavbar() {
  const { isAuthenticated } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-lg font-bold text-white shadow-lg shadow-brand-500/25">
            AI
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Resume Analyzer</p>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">
              Startup-grade hiring intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-brand-500">
            Features
          </a>
          <a href="#testimonials" className="transition hover:text-brand-500">
            Testimonials
          </a>
          <a href="#pricing" className="transition hover:text-brand-500">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/app">
              <Button>Open Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Start Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
