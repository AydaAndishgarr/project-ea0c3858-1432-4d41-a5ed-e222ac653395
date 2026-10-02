/**
 * Demo mode is the safe default for public presentation.
 * Set VITE_DEMO_MODE=false only when a live API should be preferred.
 */
export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE !== "false" && import.meta.env.VITE_DEMO_MODE !== "0";

export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:3001/api/v1"
).replace(/\/$/, "");

export const APP_NAME = "خانه یار";
export const APP_TAGLINE = "مدیریت هوشمند ساختمان";
export const APP_TITLE = `${APP_NAME} | ${APP_TAGLINE}`;
