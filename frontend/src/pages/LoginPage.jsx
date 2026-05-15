import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { AuthShell } from "../components/layout/AuthShell";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(formValues);
      toast.success("Welcome back.");
      navigate(location.state?.from || "/app");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Step back into your AI hiring workspace."
      description="Log in to continue analyzing resumes, tracking ATS scores, and exporting polished reports."
      footer={
        <>
          Need an account?{" "}
          <Link to="/signup" className="font-semibold text-brand-500">
            Create one
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold">Email</label>
          <input
            type="email"
            required
            value={formValues.email}
            onChange={(event) => setFormValues((current) => ({ ...current, email: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Password</label>
          <input
            type="password"
            required
            value={formValues.password}
            onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="Password123"
          />
        </div>
        <Button type="submit" className="mt-2 w-full" size="lg" disabled={submitting}>
          {submitting ? "Signing in..." : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}
