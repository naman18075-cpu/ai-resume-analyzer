import { cn } from "../../utils/cn";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-sm",
        variant === "primary" &&
          "bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-400",
        variant === "secondary" &&
          "border border-slate-300 bg-white/70 text-slate-900 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800",
        variant === "ghost" &&
          "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
