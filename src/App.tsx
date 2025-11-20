import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { StudyLayout } from "@/components/StudyLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import ChatPage from "./pages/study/ChatPage";
import ContentGenerator from "./pages/study/ContentGenerator";
import Interview from "./pages/study/Interview";
import LearningGames from "./pages/study/LearningGames";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes with header/footer */}
              <Route
                path="/"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                      <Home />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/tools"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Tools />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Learn />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Chat />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Dashboard />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mock-interview"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <MockInterview />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                        <Roadmap />
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                      <FAQ />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route
                path="/legal/privacy"
                element={
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                      <Privacy />
                    </main>
                    <Footer />
                  </div>
                }
              />
              <Route path="/auth" element={<Auth />} />

              {/* Study routes with sidebar (protected) */}
              <Route
                path="/study/chat"
                element={
                  <StudyLayout>
                    <ChatPage />
                  </StudyLayout>
                }
              />
              <Route
                path="/study/content"
                element={
                  <StudyLayout>
                    <ContentGenerator />
                  </StudyLayout>
                }
              />
              <Route
                path="/study/interview"
                element={
                  <StudyLayout>
                    <Interview />
                  </StudyLayout>
                }
              />
              <Route
                path="/study/games"
                element={
                  <StudyLayout>
                    <LearningGames />
                  </StudyLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <StudyLayout>
                    <Profile />
                  </StudyLayout>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
