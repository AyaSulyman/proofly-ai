import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: ReactNode;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="mb-1.5 block text-[12.5px] font-bold text-navy-600">
        {label}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-[11.5px] text-navy-300">{hint}</p>}
    </div>
  );
}

export function Input({
  icon,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300">
          {icon}
        </span>
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-line bg-[#F9FAFD] px-3.5 py-3 text-[13.5px] text-navy-700 outline-none transition placeholder:text-navy-300 focus:border-gold-500 focus:bg-white",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[110px] resize-y rounded-xl border border-line bg-[#F9FAFD] px-3.5 py-3 text-[13.5px] text-navy-700 outline-none transition placeholder:text-navy-300 focus:border-gold-500 focus:bg-white",
        className
      )}
      {...props}
    />
  );
}
