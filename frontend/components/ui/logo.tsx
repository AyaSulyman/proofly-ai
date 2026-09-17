import { cn } from "@/lib/utils";
import Link from "next/link";

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center bg-gradient-to-br from-gold-300 to-gold-500 font-extrabold text-navy-700"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.47,
        clipPath:
          "polygon(50% 0%, 100% 18%, 100% 62%, 50% 100%, 0% 62%, 0% 18%)",
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
        <div className={cn("text-[19px] font-extrabold", dark ? "text-white" : "text-navy-600")}>
          Proofly AI
        </div>
        <div className={cn("text-[10.5px] font-medium", dark ? "text-navy-100/80" : "text-navy-300")}>
          Trust more. Risk less.
        </div>
      </div>
    </Link>
  );
}
