import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import CreateCasePage from "./pages/CreateCasePage";
import WorkOrderReviewPage from "./pages/WorkOrderReviewPage";
import ContractorTaskPage from "./pages/ContractorTaskPage";
import AIVerificationPage from "./pages/AIVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import AuditTrailPage from "./pages/AuditTrailPage";
import ReportsPage from "./pages/ReportsPage";
import { Toaster } from 'react-hot-toast';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/create-case" element={<CreateCasePage />} />
        <Route path="/work-order/:id" element={<WorkOrderReviewPage />} />
        <Route path="/contractor-task/:id" element={<ContractorTaskPage />} />
        <Route path="/ai-verification/:id" element={<AIVerificationPage />} />
        <Route path="/audit-trail/:id" element={<AuditTrailPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
