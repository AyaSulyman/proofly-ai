import { PageHead } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { disputes } from "@/lib/mock-data";

export default function DisputesPage() {
  return (
    <div>
      <PageHead
        title="My Disputes"
        description="Reports where the other party has responded. Both sides submit evidence; a moderator decides."
      />
      <div className="space-y-2.5">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border-l-4 border-l-gold-500 border-y border-r border-line bg-white p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
              ⚖️
            </div>
            <div className="min-w-0 flex-1">
              <b className="mb-0.5 block text-[13.5px]">{d.subjectName}</b>
              <span className="text-[11.5px] text-navy-300">
                Dispute #{d.id} · Last activity {d.messages.at(-1)?.createdAt}
              </span>
            </div>
            <Badge tone="info">Awaiting You</Badge>
            <Button href={`/disputes/${d.id}`} variant="gold" size="sm">
              Respond →
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
