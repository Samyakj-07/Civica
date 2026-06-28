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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ContractorTaskListPage from "./pages/ContractorTaskListPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/create-case" element={
          <ProtectedRoute allowedRoles={['citizen', 'admin']}><Layout><CreateCasePage /></Layout></ProtectedRoute>
        } />
        <Route path="/work-order/:id" element={
          <ProtectedRoute allowedRoles={['admin']}><Layout><WorkOrderReviewPage /></Layout></ProtectedRoute>
        } />
        <Route path="/contractor-task-list" element={
          <ProtectedRoute allowedRoles={['contractor']}><Layout><ContractorTaskListPage /></Layout></ProtectedRoute>
        } />
        <Route path="/contractor-task/:id" element={
          <ProtectedRoute allowedRoles={['contractor']}><Layout><ContractorTaskPage /></Layout></ProtectedRoute>
        } />
        <Route path="/ai-verification/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'auditor']}><Layout><AIVerificationPage /></Layout></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'auditor']}><Layout><DashboardPage /></Layout></ProtectedRoute>
        } />
        <Route path="/audit-trail/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'auditor']}><Layout><AuditTrailPage /></Layout></ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin', 'auditor']}><Layout><ReportsPage /></Layout></ProtectedRoute>
        } />
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
