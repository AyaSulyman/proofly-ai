import { NextResponse } from "next/server";
import { API_URL, getAccessToken } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAccessToken();
  if (!token) return NextResponse.json({ detail: "Authentication required." }, { status: 401 });
  const response = await fetch(`${API_URL}/api/investigations/${id}/pdf/`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
  });
  if (!response.ok) return NextResponse.json({ detail: "Could not generate the PDF." }, { status: response.status });
  return new NextResponse(await response.arrayBuffer(), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="proofly-${id}.pdf"` },
  });
}
