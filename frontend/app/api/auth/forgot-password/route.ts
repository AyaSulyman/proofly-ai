import { NextResponse } from "next/server";
import { API_URL } from "@/lib/session";

export async function POST(request: Request) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await request.json()),
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
