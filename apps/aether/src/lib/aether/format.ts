export function money(n: number) {
  const formatted = Math.abs(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return n < 0 ? `−${formatted}` : formatted;
}
export function hours(n: number) {
  return `${n.toFixed(2)}h`;
}
export function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
}
export function formatDateShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-US", {
    month: "short", day: "numeric", timeZone: "UTC",
  });
}
export function formatTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/New_York",
  });
}
export function weekday(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-US", {
    weekday: "short", timeZone: "UTC",
  });
}
export function rangeLabel(start: string, end: string) {
  return `${formatDateShort(start)} – ${formatDateShort(end)}`;
}
export function hashShort(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `sha256:${(h >>> 0).toString(16).padStart(8, "0")}`;
}
export function scoreTone(score: number): "ok" | "warn" | "danger" {
  if (score >= 78) return "ok";
  if (score >= 60) return "warn";
  return "danger";
}
