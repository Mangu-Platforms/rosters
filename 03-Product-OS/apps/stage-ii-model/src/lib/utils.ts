export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function usd(n: number, opts?: { sign?: boolean }) {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: abs >= 100 ? 0 : 2,
  });
  if (opts?.sign && n !== 0) return `${n > 0 ? "+" : "−"}${formatted}`;
  if (n < 0) return `−${formatted}`;
  return formatted;
}
