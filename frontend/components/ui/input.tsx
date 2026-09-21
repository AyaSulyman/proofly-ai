"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
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
          "w-full rounded-xl border border-line bg-[#FFFCF7] px-3.5 py-3 text-[13.5px] text-navy-700 outline-none transition placeholder:text-navy-300 focus:border-gold-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(186,112,79,.10)]",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { icon?: ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={cn("pr-11", props.className)} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-navy-600"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
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
        "w-full min-h-[110px] resize-y rounded-xl border border-line bg-[#FFFCF7] px-3.5 py-3 text-[13.5px] text-navy-700 outline-none transition placeholder:text-navy-300 focus:border-gold-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(186,112,79,.10)]",
        className
      )}
      {...props}
    />
  );
}
