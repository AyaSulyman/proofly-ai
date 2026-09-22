import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "gold" | "navy" | "outline" | "danger-outline" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition duration-200 active:translate-y-px disabled:opacity-45 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  gold: "border border-gold-300 bg-gold-300 !text-[#070c16] shadow-[0_10px_28px_rgba(231,184,87,.18)] hover:-translate-y-0.5 hover:bg-[#F4D58A]",
  navy: "border border-gold-500/45 bg-navy-600 text-white shadow-[0_10px_28px_rgba(0,0,0,.25)] hover:-translate-y-0.5 hover:border-gold-300 hover:bg-[#182944]",
  outline: "border border-line bg-white text-navy-700 hover:-translate-y-0.5 hover:border-gold-500 hover:bg-gold-500/10",
  "danger-outline": "bg-white border border-danger-bg text-danger hover:bg-danger-bg",
  ghost: "bg-transparent text-navy-500 hover:bg-navy-50 hover:text-navy-700",
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

  const {
    href: _href,
    variant: _variant,
    size: _size,
    block: _block,
    className: _className,
    children: _children,
    ...rest
  } = props as ButtonAsButton;
  void [_href, _variant, _size, _block, _className, _children];
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
