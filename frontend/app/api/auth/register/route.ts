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

  const registerRes = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const registerData = await registerRes.json();
  if (!registerRes.ok) {
    return NextResponse.json(registerData, { status: registerRes.status });
  }

  // Immediately log in so the person lands straight in the app.
  const loginRes = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    return NextResponse.json({ user: registerData }, { status: 201 });
  }

  const response = NextResponse.json({ user: loginData.user });
  response.cookies.set(ACCESS_COOKIE, loginData.access, { ...COOKIE_OPTS, maxAge: 60 * 30 });
  response.cookies.set(REFRESH_COOKIE, loginData.refresh, { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 7 });
  return response;
}
