// OAuth redirectTo 등 사이트 절대 URL이 필요한 곳에서 사용.
// 우선순위: NEXT_PUBLIC_SITE_URL (명시) > NEXT_PUBLIC_VERCEL_URL (Vercel 자동 주입) > window.location.origin
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  if (typeof window !== "undefined") return window.location.origin;

  return "http://localhost:3000";
}
