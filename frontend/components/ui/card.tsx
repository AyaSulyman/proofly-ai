import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-line bg-white shadow-[0_12px_34px_rgba(0,0,0,.18)] transition hover:border-gold-500/35 hover:shadow-card-sm",
        padded && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="display-type text-[18px] font-bold text-navy-700">{title}</h3>
      {action}
    </div>
  );
}
