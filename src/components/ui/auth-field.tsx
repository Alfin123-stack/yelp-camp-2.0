// auth-field.tsx
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthField({ label, id, className, ...props }: AuthFieldProps) {
  const inputId = id ?? props.name;

  return (
    <div className="relative">
      <input
        id={inputId}
        placeholder=" "
        className={cn(
          "peer h-14 w-full rounded-[10px] border border-forest-200 bg-cream-50 px-5 pt-4 font-sans text-base text-forest-950 outline-none transition-colors placeholder-shown:pt-0 focus:border-forest-600 dark:border-forest-700 dark:bg-forest-900/40 dark:text-cream-50 dark:focus:border-gold-400",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 font-sans text-base text-forest-600/50 transition-all duration-150 peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs dark:text-cream-100/40"
      >
        {label}
      </label>
    </div>
  );
}