import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "ok";
}) {
  return (
    <button
      className={cn(
        "btn",
        variant === "primary" && "btn-primary",
        variant === "ghost" && "btn-ghost",
        variant === "outline" && "btn-outline",
        variant === "ok" && "btn-ok",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  tone = "muted",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "muted" | "ember" | "ok" | "warn" | "accent";
}) {
  return (
    <span
      className={cn(
        "badge",
        tone === "ember" && "badge-ember",
        tone === "ok" && "badge-ok",
        tone === "warn" && "badge-warn",
        tone === "accent" && "badge-accent",
        className,
      )}
      {...props}
    />
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("panel", className)}>{children}</section>;
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "ember" | "ok" | "warn";
}) {
  return (
    <div>
      <p className="stat-label">{label}</p>
      <p className={cn("stat-value tabular", tone)}>{value}</p>
      {hint ? <p className="stat-hint">{hint}</p> : null}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "color-mix(in oklab, var(--bg) 70%, transparent)",
        padding: 12,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="panel"
        style={{ width: "100%", maxWidth: 512, marginBottom: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="serif" style={{ margin: 0, fontSize: 28 }}>
          {title}
        </h2>
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </div>
  );
}
