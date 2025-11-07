import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider, useConfig } from "./config/ConfigContext";
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

// Inner app component that uses config
const AppContent = () => {
  const config = useConfig();
  const { auth0 } = config;

  // Validate Auth0 configuration
  if (!auth0.domain || !auth0.clientId || !auth0.redirectUri) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ color: 'red', marginBottom: '20px' }}>Configuration Error</h1>
          <p>Required Auth0 configuration is missing from backend.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
            <li>Domain: {auth0.domain || '❌ NOT SET'}</li>
            <li>Client ID: {auth0.clientId ? '✓ Set' : '❌ NOT SET'}</li>
            <li>Redirect URI: {auth0.redirectUri || '❌ NOT SET'}</li>
            <li>Audience: {auth0.audience || '⚠ Optional'}</li>
          </ul>
          <p>Please check backend configuration endpoint: /api/config</p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={auth0.domain}
      clientId={auth0.clientId}
      authorizationParams={{
        redirect_uri: auth0.redirectUri,
        audience: auth0.audience,
      }}
    >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/app">
          <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes - All under /budget context */}
            <Route path="/budget/dashboard" element={
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
            
            {/* Redirect root to /budget/dashboard */}
            <Route path="/" element={<Navigate to="/budget/dashboard" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </Auth0Provider>
  );
};

// Main App component with ConfigProvider
const App = () => {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
};

export default App;
