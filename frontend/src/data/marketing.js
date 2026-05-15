import {
  Activity,
  BadgeCheck,
  BrainCircuit,
  FileSearch,
  LineChart,
  Sparkles,
} from "lucide-react";

export const features = [
  {
    title: "ATS Match Intelligence",
    description:
      "Blend semantic scoring, keyword coverage, and section quality into a recruiter-style fit score.",
    icon: FileSearch,
  },
  {
    title: "Actionable AI Suggestions",
    description:
      "Generate stronger bullet rewrites, role-specific recommendations, and interview preparation prompts.",
    icon: BrainCircuit,
  },
  {
    title: "Trend-Based Dashboard",
    description:
      "Track score progression, skill gaps, and analysis history in a polished analytics workspace.",
    icon: LineChart,
  },
  {
    title: "Client-Ready Reporting",
    description:
      "Export premium PDF reports that make candidate coaching and hiring conversations clearer.",
    icon: BadgeCheck,
  },
  {
    title: "Fast Upload Workflow",
    description:
      "Drag in PDF or DOCX resumes, paste a job description, and move from upload to insight in minutes.",
    icon: Activity,
  },
  {
    title: "Modern Resume Studio",
    description:
      "Preview rewrite ideas, recommended roles, and resume templates in one startup-style interface.",
    icon: Sparkles,
  },
];

export const testimonials = [
  {
    name: "Sofia Bennett",
    role: "Founder, ElevateHire",
    quote:
      "This feels like a product we could ship to customers tomorrow. The analysis quality is sharp and the UI looks premium.",
  },
  {
    name: "Marcus Reed",
    role: "Career Coach",
    quote:
      "The suggestions are practical, not generic. My clients immediately understand what to change and why it matters.",
  },
  {
    name: "Neha Kapoor",
    role: "Talent Ops Lead",
    quote:
      "The dashboard makes resume screening more consistent across our hiring team, especially for technical roles.",
  },
];

export const pricing = [
  {
    tier: "Starter",
    price: "$19",
    description: "For individual candidates optimizing a job search.",
    features: ["10 analyses / month", "PDF export", "AI rewrite suggestions"],
  },
  {
    tier: "Growth",
    price: "$59",
    description: "For coaches and recruiters managing multiple profiles.",
    features: ["Unlimited analyses", "Team dashboard", "Admin analytics", "Priority AI usage"],
    featured: true,
  },
  {
    tier: "Scale",
    price: "Custom",
    description: "For hiring teams and SaaS platforms embedding analysis at scale.",
    features: ["API access", "White-label flows", "Priority support", "Usage reporting"],
  },
];
