import { NextResponse } from "next/server";

// only because of render deployment
// Pings backends on the server-side so they wake up at the same time as the frontend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const WS_BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_WS_BACKEND_HTTP_URL;

let pinged = false;

export async function middleware() {
  if (!pinged) {
    pinged = true;
    // Must await so Edge Runtime doesn't kill the requests before they complete
    await Promise.allSettled([
      BACKEND_URL ? fetch(`${BACKEND_URL}/health`).catch(() => {}) : Promise.resolve(),
      WS_BACKEND_HTTP_URL ? fetch(`${WS_BACKEND_HTTP_URL}/health`).catch(() => {}) : Promise.resolve(),
    ]);
  }
  return NextResponse.next();
}

// Only run middleware on page navigations, not on static assets or API routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
};