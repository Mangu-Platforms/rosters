import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "@/components/shell";
import { Landing } from "@/pages/landing";
import {
  OperatorCash,
  OperatorCompliance,
  OperatorCredits,
  OperatorCrew,
  OperatorForecast,
  OperatorRun,
  OperatorTime,
  OperatorToday,
} from "@/pages/operator";
import { CeoCredits, CeoHealth, CeoHome, CeoSites } from "@/pages/ceo";
import { EmployeeCoach, EmployeeHome, EmployeePay, EmployeeTime } from "@/pages/employee";
import {
  Architecture,
  Documents,
  Feasibility,
  Features,
  Moat,
  Pages,
  Verdict,
} from "@/pages/briefing";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/operator" element={<Shell role="operator"><OperatorToday /></Shell>} />
      <Route path="/operator/run" element={<Shell role="operator"><OperatorRun /></Shell>} />
      <Route path="/operator/crew" element={<Shell role="operator"><OperatorCrew /></Shell>} />
      <Route path="/operator/time" element={<Shell role="operator"><OperatorTime /></Shell>} />
      <Route path="/operator/compliance" element={<Shell role="operator"><OperatorCompliance /></Shell>} />
      <Route path="/operator/credits" element={<Shell role="operator"><OperatorCredits /></Shell>} />
      <Route path="/operator/forecast" element={<Shell role="operator"><OperatorForecast /></Shell>} />
      <Route path="/operator/cash" element={<Shell role="operator"><OperatorCash /></Shell>} />
      <Route path="/ceo" element={<Shell role="ceo"><CeoHome /></Shell>} />
      <Route path="/ceo/health" element={<Shell role="ceo"><CeoHealth /></Shell>} />
      <Route path="/ceo/credits" element={<Shell role="ceo"><CeoCredits /></Shell>} />
      <Route path="/ceo/sites" element={<Shell role="ceo"><CeoSites /></Shell>} />
      <Route path="/employee" element={<Shell role="employee"><EmployeeHome /></Shell>} />
      <Route path="/employee/pay" element={<Shell role="employee"><EmployeePay /></Shell>} />
      <Route path="/employee/time" element={<Shell role="employee"><EmployeeTime /></Shell>} />
      <Route path="/employee/coach" element={<Shell role="employee"><EmployeeCoach /></Shell>} />
      <Route path="/briefing" element={<Shell role="briefing"><Verdict /></Shell>} />
      <Route path="/briefing/features" element={<Shell role="briefing"><Features /></Shell>} />
      <Route path="/briefing/pages" element={<Shell role="briefing"><Pages /></Shell>} />
      <Route path="/briefing/architecture" element={<Shell role="briefing"><Architecture /></Shell>} />
      <Route path="/briefing/feasibility" element={<Shell role="briefing"><Feasibility /></Shell>} />
      <Route path="/briefing/documents" element={<Shell role="briefing"><Documents /></Shell>} />
      <Route path="/briefing/moat" element={<Shell role="briefing"><Moat /></Shell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
