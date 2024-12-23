import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import UserInfo from "./pages/UserInfo";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const hasUserData = !!localStorage.getItem("userData");

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  hasUserData ? <Navigate to="/main" /> : <Navigate to="/user-info" />
                }
              />
              <Route path="/user-info" element={<UserInfo />} />
              <Route path="/main" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;