import { NextResponse } from "next/server";
import { API_URL, ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(ACCESS_COOKIE, data.access, { ...COOKIE_OPTS, maxAge: 60 * 30 });
  response.cookies.set(REFRESH_COOKIE, data.refresh, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 7 });
  return response;
}
