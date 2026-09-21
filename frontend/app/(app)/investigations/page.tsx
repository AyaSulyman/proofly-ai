import Link from "next/link";
import { PageHead } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { cn} from "@/lib/utils";
import type {
  InvestigationStatus,
  RiskLevel,
  SubjectType,
} from "@/lib/types";

const STATUS_STYLE: Record<InvestigationStatus, string> = {
  draft:
    "bg-navy-50 text-navy-300 hover:!bg-[#E8C7A7] hover:!text-[#651B2B]",
  analyzing:
    "bg-info-bg text-info hover:!bg-[#E8C7A7] hover:!text-[#651B2B]",
  completed:
    "bg-ok-bg text-ok hover:!bg-[#E8C7A7] hover:!text-[#651B2B]",
};
const STATUS_LABEL: Record<InvestigationStatus, string> = {
  draft: "Draft",
  analyzing: "Analyzing",
  completed: "Completed",
};

const SUBJECT_ICON: Record<SubjectType, string> = {
  seller: "🛍️",
  listing: "📋",
  website: "🌐",
  business: "🏢",
  freelancer: "💼",
  rental: "🏠",
  message: "💬",
  other: "➕",
};

interface InvestigationListItem {
  id: string;
  title: string;
  subjectType: SubjectType;
  status: InvestigationStatus;
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  createdAt: string;
  imageUrl: string | null;
}

interface InvestigationSearchParams {
  status?: string;
  q?: string;
}

const FILTERS: Array<{
  label: string;
  value: "all" | InvestigationStatus;
}> = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Analyzing", value: "analyzing" },
  { label: "Completed", value: "completed" },
];

export default async function InvestigationsPage({
  searchParams,
}: {
  searchParams: Promise<InvestigationSearchParams>;
}) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();

  const activeStatus = FILTERS.some(
    (filter) => filter.value === params.status
  )
    ? params.status!
    : "all";

  const data = await apiFetch<{
    count: number;
    results: InvestigationListItem[];
  }>("/api/investigations/");

  const allInvestigations = data.results;

  const counts = {
    all: allInvestigations.length,
    draft: allInvestigations.filter(
      (investigation) => investigation.status === "draft"
    ).length,
    analyzing: allInvestigations.filter(
      (investigation) => investigation.status === "analyzing"
    ).length,
    completed: allInvestigations.filter(
      (investigation) => investigation.status === "completed"
    ).length,
  };

  const investigations = allInvestigations.filter((investigation) => {
    const matchesStatus =
      activeStatus === "all" || investigation.status === activeStatus;

    const matchesSearch =
      !normalizedQuery ||
      investigation.title.toLowerCase().includes(normalizedQuery) ||
      investigation.subjectType.toLowerCase().includes(normalizedQuery) ||
      STATUS_LABEL[investigation.status]
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });

  const hasActiveFiltering =
    activeStatus !== "all" || normalizedQuery.length > 0;

  return (
    <div>
      <PageHead
        title="My Investigations"
        description="Everything you've checked, in one place."
        action={
         <Button
  href="/investigations/new"
  variant="navy"
  className="!border-[#E8C7A7] !bg-[#E8C7A7] !text-[#651B2B] hover:!bg-[#DFC09F] hover:!text-[#651B2B]"
>
  + New Investigation
</Button>
        }
      />

      {query && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[12.5px] text-navy-300">
          <span>
            Showing results for{" "}
            <b className="text-navy-700">&quot;{query}&quot;</b>
          </span>

          <Link
            href={`/investigations?status=${activeStatus}`}
            className="ml-auto font-semibold text-navy-600 hover:text-navy-700"
          >
            Clear search
          </Link>
        </div>
      )}

      <div className="mb-4.5 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const filterParams = new URLSearchParams();

          filterParams.set("status", filter.value);

          if (query) {
            filterParams.set("q", query);
          }

          return (
        <Link
  key={filter.value}
  href={`/investigations?${filterParams.toString()}`}
  className={cn(
    "rounded-xl border px-4 py-2 text-[12.5px] font-semibold transition-colors duration-200",
    activeStatus === filter.value
      ? "border-[#E8C7A7] !bg-[#E8C7A7] !text-[#651B2B]"
      : "border-line bg-white !text-[#651B2B] hover:!border-[#E8C7A7] hover:!bg-[#E8C7A7] hover:!text-[#651B2B]"
  )}
>
  {filter.label} ({counts[filter.value]})
</Link>
          );
        })}
      </div>

      {investigations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-xl">
            🔍
          </div>

          <p className="mb-4 text-sm text-navy-300">
            {hasActiveFiltering
              ? "No investigations match your search or selected filter."
              : "You haven't created any investigations yet."}
          </p>

          {hasActiveFiltering ? (
            <Link
              href="/investigations?status=all"
              className="font-semibold text-navy-600 hover:text-navy-700"
            >
              View all investigations →
            </Link>
          ) : (
            <Link
              href="/investigations/new"
              className="font-semibold text-navy-600 hover:text-navy-700"
            >
              Start your first one →
            </Link>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {investigations.map((investigation) => (
          <div
            key={investigation.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-gold-300 hover:shadow-card-sm"
          >
            {investigation.imageUrl ? (
              <Avatar
                src={investigation.imageUrl}
                name={investigation.title}
                size="sm"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
                {SUBJECT_ICON[investigation.subjectType]}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <b className="mb-0.5 block truncate text-[13.5px]">
                {investigation.title}
              </b>

              <span className="text-[11.5px] capitalize text-navy-300">
                {investigation.subjectType} · Created{" "}
                {formatDate(investigation.createdAt)}
              </span>
            </div>

            {investigation.riskLevel && (
              <RiskBadge level={investigation.riskLevel} />
            )}

          <span
  className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold transition-colors duration-200 ${
    STATUS_STYLE[investigation.status]
  }`}
>
  {STATUS_LABEL[investigation.status]}
</span>

            <Button
              href={
                investigation.status === "draft"
                  ? `/investigations/${investigation.id}/evidence`
                  : `/investigations/${investigation.id}`
              }
              variant="outline"
              size="sm"
            >
              {investigation.status === "draft" ? "Resume →" : "View →"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}