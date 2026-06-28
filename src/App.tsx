import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import CreateCasePage from "./pages/CreateCasePage";
import WorkOrderReviewPage from "./pages/WorkOrderReviewPage";
import ContractorTaskPage from "./pages/ContractorTaskPage";

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-case" element={<CreateCasePage />} />
        <Route path="/work-order" element={<WorkOrderReviewPage />} />
        <Route path="/contractor-task" element={<ContractorTaskPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
