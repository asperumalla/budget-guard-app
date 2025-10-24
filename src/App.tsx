import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import SetBudget from "./pages/SetBudget";
import AddExpense from "./pages/AddExpense";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/budget-guard-app">
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/budget/login" element={<Login />} />
            
            {/* Protected Routes - All under /budget context */}
            <Route path="/budget" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/budget/transactions" element={
              <ProtectedRoute>
                <Layout>
                  <Transactions />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/budget/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/budget/set-budget" element={
              <ProtectedRoute>
                <Layout>
                  <SetBudget />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/budget/add-expense" element={
              <ProtectedRoute>
                <Layout>
                  <AddExpense />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect root to /budget */}
            <Route path="/" element={<Navigate to="/budget" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
