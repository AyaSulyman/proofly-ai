import { PageHead } from "@/components/layout/app-shell";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/session";
import { EvidenceUploader } from "./evidence-uploader";
import { IdentifierEditor } from "./identifier-editor";

const STEPS = [
  { label: "Subject & Details" },
  { label: "Evidence" },
  { label: "AI Review" },
  { label: "Report" },
];

interface EvidenceRow {
  id: string;
  type: string;
  fileName: string;
  category?: string;
}

export default async function EvidenceUploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await apiFetch<{ results: EvidenceRow[] }>(`/api/investigations/${id}/evidence/`);
  const identifiers = await apiFetch<{ results: { id: number; type: string; value: string }[] }>(`/api/investigations/${id}/identifiers/`);
  const rows = data.results;

  return (
    <div>
      <PageHead
        title="Add or update evidence"
        description="Add, replace, or remove evidence at any time. Re-analysis creates a new score version so changes stay transparent."
      />
      <StepIndicator steps={STEPS} currentIndex={1} />

      <IdentifierEditor investigationId={id} rows={identifiers.results} />
      <EvidenceUploader investigationId={id} initialRows={rows} />

      <div className="mt-6 flex max-w-4xl justify-between">
        <Button href={`/investigations/${id}`} variant="outline">
          ← Report
        </Button>
        <Button href={`/investigations/${id}/review`} variant="navy">
          Continue to AI Review →
        </Button>
      </div>
    </div>
  );
}
