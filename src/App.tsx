import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MigrationProvider } from "@/contexts/MigrationContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import MigrationList from "./pages/MigrationList";
import MigrationDetail from "./pages/MigrationDetail";
import MigrationCalendar from "./pages/MigrationCalendar";
import TaskTemplates from "./pages/TaskTemplates";
import MyTasks from "./pages/MyTasks";
import AccountManagement from "./pages/AccountManagement";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <MigrationProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-12 flex items-center border-b bg-card px-2">
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/migrations" element={<MigrationList />} />
                <Route path="/migrations/:id" element={<MigrationDetail />} />
                <Route path="/calendar" element={<MigrationCalendar />} />
                <Route path="/templates" element={<TaskTemplates />} />
                <Route path="/my-tasks" element={<MyTasks />} />
                <Route path="/accounts" element={<AccountManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </MigrationProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
