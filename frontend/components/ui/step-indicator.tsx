import { cn } from "@/lib/utils";

export interface Step {
  label: string;
}

export function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: Step[];
  currentIndex: number;
}) {
  return (
    <div className="mb-8 flex max-w-3xl items-center">
      {steps.map((step, i) => (
        <div key={step.label} className="flex flex-1 items-center last:flex-none">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold",
                i < currentIndex && "bg-ok text-[#070C16]",
                i === currentIndex && "bg-navy-600 text-white",
                i > currentIndex && "bg-navy-50 text-navy-300"
              )}
            >
              {i < currentIndex ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "whitespace-nowrap text-xs font-semibold",
                i === currentIndex ? "text-navy-700" : "text-navy-300"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-2.5 h-0.5 flex-1",
                i < currentIndex ? "bg-ok" : "bg-line"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
