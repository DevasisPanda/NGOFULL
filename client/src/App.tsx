import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPanel from "./pages/AdminPanel";
import MemberDashboard from "./pages/MemberDashboard";
import MembershipManagementPage from "./pages/MembershipManagementPage";
import DonationManagementPage from "./pages/DonationManagementPage";
import ActiveCampaignsPage from "./pages/admin/crowdfunding/ActiveCampaignsPage";
import { trpc } from "@/lib/trpc";

function SSOReceiver() {
  const [, setLocation] = useLocation();
  const consumeHandoff = trpc.auth.consumeHandoff.useMutation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const code = searchParams.get("code");
    const role = searchParams.get("role");

    if (token) {
      localStorage.setItem("authToken", token);
      if (role) {
        localStorage.setItem("userRole", role);
      }
      
      // Force reload to update token in components, or navigate
      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/member-dashboard";
      }
    } else if (code) {
      consumeHandoff.mutate(
        { handoffCode: code },
        {
          onSuccess: (data) => {
            localStorage.setItem("authToken", data.token);
            if (role) {
              localStorage.setItem("userRole", role);
            }
            if (role === "admin") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/member-dashboard";
            }
          },
          onError: (err) => {
            console.error("SSO Handoff consumption failed:", err);
            window.location.href = "/login?error=handoff_failed";
          }
        }
      );
    } else {
      window.location.href = "/login";
    }
  }, [setLocation]);

  return <div className="flex h-screen w-full items-center justify-center">Authenticating securely...</div>;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (role !== "admin") {
      setLocation("/member-dashboard");
    }
  }, [role, setLocation]);

  return role === "admin" ? <Component /> : null;
}

function MemberRoute({ component: Component }: { component: React.ComponentType }) {
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (role === "admin") {
      setLocation("/admin");
    }
  }, [role, setLocation]);

  return role !== "admin" ? <Component /> : null;
}

function Router() {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/login"} component={LoginPage} />
      <Route path={"/register"} component={RegisterPage} />

      {/* SSO Route */}
      <Route path={"/sso"} component={SSOReceiver} />

      {/* Auth Routes */}
      <Route path={/^\/admin/} component={() => <AdminRoute component={AdminPanel} />} />
      <Route path={"/member-dashboard"} component={() => <MemberRoute component={MemberDashboard} />} />
      <Route path={"/member/membership"} component={() => <MemberRoute component={MembershipManagementPage} />} />
      <Route path={"/member/donations"} component={() => <MemberRoute component={DonationManagementPage} />} />
      <Route path={"/member/campaigns"} component={() => <MemberRoute component={ActiveCampaignsPage} />} />

      {/* Home - redirect based on auth status */}
      <Route path={"/"} component={token ? (role === "admin" ? AdminPanel : MemberDashboard) : Home} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={LoginPage} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
