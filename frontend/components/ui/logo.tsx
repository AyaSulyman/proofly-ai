import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl border border-gold-300/60 bg-gold-500/10 text-gold-300 shadow-[0_5px_18px_rgba(0,0,0,.28)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.47,
      }}
    >
      <ShieldCheck size={size * 0.58} strokeWidth={2} />
    </div>
  );
}

export function Logo({
  className,
  dark,
  href = "/",
}: {
  className?: string;
  dark?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="leading-tight">
        <div className={cn("display-type text-[21px] font-bold tracking-[-.02em]", dark ? "text-white" : "text-gold-300")}>
          Proofly<span className="text-gold-300">AI</span>
        </div>
        <div className={cn("text-[10.5px] font-medium", dark ? "text-navy-100/80" : "text-navy-300")}>
          Trust more. Risk less.
        </div>
      </div>
    </Link>
  );
}
