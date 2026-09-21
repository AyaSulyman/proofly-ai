import { cn } from "@/lib/utils";
import Link from "next/link";

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[30%_70%_58%_42%/40%_35%_65%_60%] border border-white/30 bg-gradient-to-br from-gold-300 to-gold-500 font-extrabold text-navy-700 shadow-[0_5px_14px_rgba(66,21,29,.18)]"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.47,
      }}
    >
      P
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
        <div className={cn("display-type text-[20px] font-bold tracking-[-.02em]", dark ? "text-white" : "text-navy-600")}>
          Proofly AI
        </div>
        <div className={cn("text-[10.5px] font-medium", dark ? "text-navy-100/80" : "text-navy-300")}>
          Trust more. Risk less.
        </div>
      </div>
    </Link>
  );
}
