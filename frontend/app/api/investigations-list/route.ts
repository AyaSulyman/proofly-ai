import { NextResponse } from "next/server";
import { apiFetch, ApiError } from "@/lib/session";

/**
 * Thin proxy so client components (which can't read the httpOnly auth
 * cookie directly) can still populate things like the "Linked Investigation"
 * dropdown on Submit Report without a page reload.
 */
export async function GET() {
  try {
    const data = await apiFetch("/api/investigations/?status=completed");
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.data, { status: err.status });
    }
    return NextResponse.json({ detail: "Unexpected error" }, { status: 500 });
  }
}
