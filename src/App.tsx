
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Players from "./pages/Players";
import Stats from "./pages/Stats";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import MatchDetails from "./pages/MatchDetails";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CreateMatch from "./pages/CreateMatch";
import ScheduledMatches from "./pages/ScheduledMatches";
import AdminPlayerManagement from "./pages/AdminPlayerManagement";
import AdminMatchManagement from "./pages/AdminMatchManagement";
import EditMatch from "./pages/EditMatch";
import { LiveMatchFlow } from "./components/live-match/LiveMatchFlow";
import { AppProvider } from "./contexts/AppContext";
import { AdminProvider } from "./contexts/AdminContext";
import { MatchProvider } from "./contexts/MatchContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuditProvider } from "./contexts/AuditContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <AdminProvider>
          <MatchProvider>
            <NotificationProvider>
              <AuditProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/live-match/:matchId" element={
                      <ProtectedRoute>
                        <LiveMatchFlow />
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding" element={
                      <ProtectedRoute>
                        <Onboarding />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/partidas" element={
                      <ProtectedRoute>
                        <ScheduledMatches />
                      </ProtectedRoute>
                    } />
                    <Route path="/players" element={
                      <ProtectedRoute>
                        <Players />
                      </ProtectedRoute>
                    } />
                    <Route path="/stats" element={
                      <ProtectedRoute>
                        <Stats />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/match/:matchId" element={
                      <ProtectedRoute>
                        <MatchDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } />
                    <Route path="/admin/criar-partida" element={
                      <AdminRoute>
                        <CreateMatch />
                      </AdminRoute>
                    } />
                    <Route path="/admin/gerenciar-jogadores" element={
                      <AdminRoute>
                        <AdminPlayerManagement />
                      </AdminRoute>
                    } />
                    <Route path="/admin/gerenciar-partidas" element={
                      <AdminRoute>
                        <AdminMatchManagement />
                      </AdminRoute>
                    } />
                    <Route path="/admin/editar-partida/:matchId" element={
                      <AdminRoute>
                        <EditMatch />
                      </AdminRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </AuditProvider>
            </NotificationProvider>
          </MatchProvider>
        </AdminProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
