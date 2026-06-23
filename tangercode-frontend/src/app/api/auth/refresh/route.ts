import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/constants";

const COOKIE_NAME = "admin_refresh_token";
const MAX_AGE = 7 * 24 * 60 * 60;

export async function GET(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) {
    return NextResponse.json(
      { error: "no refresh token" },
      { status: 401 },
    );
  }

  const refreshToken = cookie.slice(COOKIE_NAME.length + 1);

  try {
    const djangoResponse = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!djangoResponse.ok) {
      const errorResponse = NextResponse.json(
        { error: "refresh failed" },
        { status: 401 },
      );
      errorResponse.cookies.delete(COOKIE_NAME);
      return errorResponse;
    }

    const data = await djangoResponse.json();
    const newAccess = data.access || data.data?.access;
    const newRefresh = data.refresh || data.data?.refresh || refreshToken;

    const response = NextResponse.json({ access: newAccess });
    response.cookies.set(COOKIE_NAME, newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "refresh service unavailable" },
      { status: 502 },
    );
  }
}
