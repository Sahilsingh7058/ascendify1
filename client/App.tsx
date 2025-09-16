import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Roadmaps from "./pages/Roadmaps";
import Assessment from "./pages/Assessment";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap everything that needs access to the auth context */}
      <AuthProvider> 
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col bg-background text-foreground">
            <SiteHeader />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
              </Routes>
            </div>
            <SiteFooter />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);