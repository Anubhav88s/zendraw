"use client";

import { useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const WS_BACKEND_HTTP_URL = process.env.NEXT_PUBLIC_WS_BACKEND_HTTP_URL;

// Pings both backends from the browser when the app first loads.
// This wakes up sleeping Render free-tier services.
export function WakeUpBackends() {
  useEffect(() => {
    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}/health`).catch(() => {});
    }
    if (WS_BACKEND_HTTP_URL) {
      fetch(`${WS_BACKEND_HTTP_URL}/health`).catch(() => {});
    }
  }, []);

  return null; // renders nothing
}
