import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Hidden access to the admin dashboard (no visible button in the UI).
 *
 * - Press Ctrl/Cmd + Shift + A to go to /admin.
 * - Click the portfolio logo five times in a row (touch-friendly fallback).
 */
export function useAdminAccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        void navigate({ to: "/admin" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.info(
        "%cHidden admin access%c\nPress Ctrl/Cmd + Shift + A, or click the logo five times.",
        "color:#06B6D4;font-weight:bold;font-size:13px",
        "",
      );
    }
  }, []);
}
