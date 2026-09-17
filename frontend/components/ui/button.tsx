import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "navy" | "outline" | "danger-outline" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition disabled:opacity-45 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  gold: "bg-gradient-to-r from-gold-500 to-gold-300 text-navy-700 shadow-[0_10px_22px_rgba(217,164,65,0.35)] hover:brightness-105",
  navy: "bg-gradient-to-r from-navy-600 to-navy-500 text-white shadow-[0_10px_22px_rgba(21,27,62,0.28)] hover:brightness-110",
  outline: "bg-white border border-line text-navy-700 hover:bg-navy-50",
  "danger-outline": "bg-white border border-danger-bg text-danger hover:bg-danger-bg",
  ghost: "bg-transparent text-navy-500 hover:bg-navy-50",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-sm",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "navy", size = "md", block, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], block && "w-full", className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
