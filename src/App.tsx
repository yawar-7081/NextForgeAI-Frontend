import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import { LoginModal } from "./components/LoginModal";
import { ProjectView } from "./pages/ProjectView";
import { ProjectsDashboard } from "./pages/ProjectsDashboard";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import OAuthSuccess from "./pages/OAuthSuccess";
import ProtectedRoute from "./hooks/ProtectedRoute";
import PublicRoute from "./hooks/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          {/* ---------------- Public Routes ---------------- */}
          <Route element={<PublicRoute />}>
            

            <Route path="/login" element={<LoginModal />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp/:userId" element={<VerifyOtp />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Route>

          {/* ---------------- Protected Routes ---------------- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Index />} />
            <Route path="/projects" element={<ProjectsDashboard />} />
            <Route path="/projects/:projectId" element={<ProjectView />} />
          </Route>

          {/* ---------------- 404 ---------------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
