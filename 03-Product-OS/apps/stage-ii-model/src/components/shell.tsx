import { Link, NavLink } from "react-router-dom";
import {
  Activity, BookOpen, Briefcase, CalendarClock, CircleDollarSign, ClipboardList,
  LayoutDashboard, Scale, ShieldAlert, Sparkles, Users, Wallet,
} from "lucide-react";
import { COMPANY, type Role } from "@/lib/data";
import { pendingCount, useAether } from "@/lib/store";
import type { ReactNode } from "react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; badge?: number };

export function Shell({ role, children }: { role: Role | "briefing"; children: ReactNode }) {
  const pending = pendingCount(useAether((s) => s.exceptions));
  const resetDemo = useAether((s) => s.resetDemo);
  const nav: NavItem[] =
    role === "ceo"
      ? [
          { to: "/ceo", label: "Overview", icon: LayoutDashboard },
          { to: "/ceo/health", label: "Health", icon: Activity },
          { to: "/ceo/credits", label: "Credits", icon: CircleDollarSign },
          { to: "/ceo/sites", label: "Sites", icon: Briefcase },
        ]
      : role === "operator"
        ? [
            { to: "/operator", label: "Today", icon: ShieldAlert, badge: pending },
            { to: "/operator/run", label: "Pay run", icon: ClipboardList },
            { to: "/operator/crew", label: "Crew", icon: Users },
            { to: "/operator/time", label: "Time", icon: CalendarClock },
            { to: "/operator/compliance", label: "Compliance", icon: Scale },
            { to: "/operator/credits", label: "Credits", icon: CircleDollarSign },
            { to: "/operator/forecast", label: "Forecast", icon: Activity },
            { to: "/operator/cash", label: "Cash", icon: Wallet },
          ]
        : role === "employee"
          ? [
              { to: "/employee", label: "Home", icon: LayoutDashboard },
              { to: "/employee/pay", label: "Pay", icon: Wallet },
              { to: "/employee/time", label: "Time", icon: CalendarClock },
              { to: "/employee/coach", label: "Coach", icon: Sparkles },
            ]
          : [
              { to: "/briefing", label: "Verdict", icon: BookOpen },
              { to: "/briefing/features", label: "Features", icon: Sparkles },
              { to: "/briefing/pages", label: "Pages", icon: LayoutDashboard },
              { to: "/briefing/architecture", label: "Architecture", icon: Scale },
              { to: "/briefing/feasibility", label: "Feasibility", icon: Activity },
              { to: "/briefing/documents", label: "Documents", icon: ClipboardList },
              { to: "/briefing/moat", label: "How it wins", icon: ShieldAlert },
            ];
  const title = role === "ceo" ? "Owner" : role === "operator" ? "Operator" : role === "employee" ? "Maria Delgado" : "War Room";
  const setRole = useAether((s) => s.setRole);
  const roles = [
    { id: "ceo" as const, to: "/ceo", label: "Owner" },
    { id: "operator" as const, to: "/operator", label: "Ops" },
    { id: "employee" as const, to: "/employee", label: "Field" },
    { id: "briefing" as const, to: "/briefing", label: "War Room" },
  ];
  return (
    <div style={{ minHeight: "100dvh" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid var(--border)", background: "color-mix(in oklab, var(--bg) 90%, transparent)", backdropFilter: "blur(8px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", height: 56, display: "flex", alignItems: "center", gap: 12, padding: "0 20px" }}>
          <Link to="/" className="serif" style={{ fontSize: 20 }}>Aether</Link>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>{COMPANY.legal} · {title}</p>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button type="button" className="btn btn-ghost" style={{ height: 32, fontSize: 11, letterSpacing: "0.08em" }} onClick={() => resetDemo()}>Reset</button>
            <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: 8, padding: 2 }}>
              {roles.map((item) => (
                <Link key={item.id} to={item.to} onClick={() => { if (item.id !== "briefing") setRole(item.id); }} style={{ borderRadius: 6, padding: "4px 10px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", background: role === item.id ? "var(--elevated)" : "transparent", color: role === item.id ? "var(--fg)" : "var(--muted)" }}>{item.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex" }}>
        <nav className="side-nav" style={{ width: 208, flexShrink: 0, padding: 16, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={["/ceo","/operator","/employee","/briefing"].includes(item.to)} style={({ isActive }) => ({ display: "flex", alignItems: "center", gap: 10, borderRadius: 8, padding: "8px 12px", fontSize: 14, background: isActive ? "var(--elevated)" : "transparent", color: isActive ? "var(--fg)" : "var(--muted)" })}>
                <Icon size={16} strokeWidth={1.75} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? <span className="tabular" style={{ borderRadius: 999, background: "color-mix(in oklab, var(--ember) 20%, transparent)", color: "var(--ember)", padding: "0 6px", fontSize: 11 }}>{item.badge}</span> : null}
              </NavLink>
            );
          })}
        </nav>
        <main style={{ minWidth: 0, flex: 1, padding: "24px 24px 96px" }}>{children}</main>
      </div>
      <style>{`@media (max-width: 767px) { .side-nav { display: none !important; } }`}</style>
    </div>
  );
}
