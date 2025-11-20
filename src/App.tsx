import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Learn from "./pages/Learn";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/legal/Privacy";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mock-interview" element={<MockInterview />} />
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/legal/privacy" element={<Privacy />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
