import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { AuthShell } from "../components/layout/AuthShell";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signup(formValues);
      toast.success("Account created.");
      navigate("/app");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create a premium AI resume analysis workspace."
      description="Set up your account to unlock ATS scoring, semantic matching, AI suggestions, and export-ready dashboards."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-500">
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold">Full name</label>
          <input
            type="text"
            required
            value={formValues.full_name}
            onChange={(event) => setFormValues((current) => ({ ...current, full_name: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="Avery Johnson"
          />
        </div>
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
            minLength={8}
            value={formValues.password}
            onChange={(event) => setFormValues((current) => ({ ...current, password: event.target.value }))}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
            placeholder="Minimum 8 characters"
          />
        </div>
        <Button type="submit" className="mt-2 w-full" size="lg" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
