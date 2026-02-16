import { NextResponse } from "next/server";

// only because of render deployment
// Pings backends on the server-side so they wake up at the same time as the frontend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const WS_BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_WS_BACKEND_HTTP_URL;

let pinged = false;

export function middleware() {
  if (!pinged) {
    pinged = true;
    if (BACKEND_URL) fetch(`${BACKEND_URL}/health`).catch(() => {});
    if (WS_BACKEND_HTTP_URL) fetch(`${WS_BACKEND_HTTP_URL}/health`).catch(() => {});
  }
  return NextResponse.next();
}