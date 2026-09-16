import { create } from "zustand";
import type { Decision, PayRunStatus, Role } from "./data";
import { EXCEPTIONS } from "./data";

type ExceptionState = {
  decision: Decision;
  reason?: string;
  clockOut?: string;
};

type Store = {
  role: Role;
  setRole: (r: Role) => void;
  payRun: PayRunStatus;
  setPayRun: (s: PayRunStatus) => void;
  exceptions: Record<string, ExceptionState>;
  decide: (id: string, decision: Decision, extra?: { reason?: string; clockOut?: string }) => void;
  resetDemo: () => void;
  ewaRequested: number;
  requestEwa: (amount: number) => void;
};

const seeded = Object.fromEntries(
  EXCEPTIONS.map((e) => [e.id, { decision: "pending" as Decision }]),
);

export const useAether = create<Store>()((set) => ({
  role: "operator",
  setRole: (role) => set({ role }),
  payRun: "previewed",
  setPayRun: (payRun) => set({ payRun }),
  exceptions: seeded,
  decide: (id, decision, extra) =>
    set((s) => ({
      exceptions: {
        ...s.exceptions,
        [id]: { decision, reason: extra?.reason, clockOut: extra?.clockOut },
      },
    })),
  resetDemo: () =>
    set({
      payRun: "previewed",
      exceptions: seeded,
      ewaRequested: 0,
    }),
  ewaRequested: 0,
  requestEwa: (amount) => set({ ewaRequested: amount }),
}));

export function pendingCount(exceptions: Record<string, ExceptionState>) {
  return Object.values(exceptions).filter((e) => e.decision === "pending").length;
}
