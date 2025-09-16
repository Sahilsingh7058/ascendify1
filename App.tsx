// import "./global.css";

// import { Toaster } from "@/components/ui/toaster";
// import { createRoot, type Root } from "react-dom/client";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Roadmaps from "./pages/Roadmaps";
// import Assessment from "./pages/Assessment";
// import Contact from "./pages/Contact";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import Community from "./pages/Community";
// import JavaRoadmap from "./pages/roadmaps/Java";
// import AWSRoadmap from "./pages/roadmaps/AWS";
// import MLRoadmap from "./pages/roadmaps/ML";
// import DataScienceRoadmap from "./pages/roadmaps/DataScience";
// import DotNetRoadmap from "./pages/roadmaps/DotNet";
// import SiteHeader from "@/components/layout/SiteHeader";
// import SiteFooter from "@/components/layout/SiteFooter";
// import BackgroundDots from "@/components/effects/BackgroundDots";
// import ParticlesBackground from "@/components/effects/ParticlesBackground";
// import JavaCourseLearningPage from "@/pages/JavaCourseLearningPage";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <div className="relative min-h-screen flex flex-col bg-background text-foreground">
//           <div className="absolute inset-0 -z-10">
//             <BackgroundDots />
//             <ParticlesBackground />
//           </div>
//           <SiteHeader />
//           <div className="flex-1">
//             <Routes>
//               <Route path="/" element={<Index />} />
//               <Route path="/roadmaps" element={<Roadmaps />} />
//               <Route path="/roadmaps/java" element={<JavaRoadmap />} />
//               <Route path="/roadmaps/aws" element={<AWSRoadmap />} />
//               <Route path="/roadmaps/ml" element={<MLRoadmap />} />
//               <Route
//                 path="/roadmaps/datascience"
//                 element={<DataScienceRoadmap />}
//               />
//               <Route path="/roadmaps/dotnet" element={<DotNetRoadmap />} />
//               <Route path="/assessment" element={<Assessment />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/signin" element={<SignIn />} />
//               <Route path="/signup" element={<SignUp />} />
//               <Route path="/community" element={<Community />} />
//               <Route path="/java-course" element={<JavaCourseLearningPage />} />
//               {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
            
//           </div>
//           <SiteFooter />
//         </div>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// declare global {
//   interface Window {
//     __fusionRoot?: Root;
//   }
// }

// const container = document.getElementById("root")!;
// let root = window.__fusionRoot;
// if (!root) {
//   root = createRoot(container);
//   window.__fusionRoot = root;
// }
// root.render(<App />);
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot, type Root } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Roadmaps from "./pages/Roadmaps";
import Assessment from "./pages/Assessment";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Community from "./pages/Community";
import JavaRoadmap from "./pages/roadmaps/Java";
import AWSRoadmap from "./pages/roadmaps/AWS";
import MLRoadmap from "./pages/roadmaps/ML";
import DataScienceRoadmap from "./pages/roadmaps/DataScience";
import DotNetRoadmap from "./pages/roadmaps/DotNet";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import BackgroundDots from "@/components/effects/BackgroundDots";
import ParticlesBackground from "@/components/effects/ParticlesBackground";
import JavaCourseLearningPage from "@/pages/JavaCourseLearningPage";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col bg-background text-foreground">
            <div className="absolute inset-0 -z-10">
              <BackgroundDots />
              <ParticlesBackground />
            </div>
            <SiteHeader />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/roadmaps/java" element={<JavaRoadmap />} />
                <Route path="/roadmaps/aws" element={<AWSRoadmap />} />
                <Route path="/roadmaps/ml" element={<MLRoadmap />} />
                <Route path="/roadmaps/datascience" element={<DataScienceRoadmap />} />
                <Route path="/roadmaps/dotnet" element={<DotNetRoadmap />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* 🔒 Protected Routes */}
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <Community />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/java-course"
                  element={
                    <ProtectedRoute>
                      <JavaCourseLearningPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <SiteFooter />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

declare global {
  interface Window {
    __fusionRoot?: Root;
  }
}

const container = document.getElementById("root")!;
let root = window.__fusionRoot;
if (!root) {
  root = createRoot(container);
  window.__fusionRoot = root;
}
root.render(<App />);
