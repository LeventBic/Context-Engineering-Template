import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Import store
import { store } from './store/store';

// Import components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Import pages
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProductsPage from './pages/Products/ProductsPage';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import ProductionPage from './pages/Production/ProductionPage';
import ProductionDetailPage from './pages/Production/ProductionDetailPage';
import BOMPage from './pages/BOM/BOMPage';
import UsersPage from './pages/Users/UsersPage';
import SettingsPage from './pages/Settings/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                
                {/* Products */}
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                
                {/* Inventory */}
                <Route path="inventory" element={<InventoryPage />} />
                
                {/* Production */}
                <Route path="production" element={<ProductionPage />} />
                <Route path="production/:id" element={<ProductionDetailPage />} />
                
                {/* BOM (Bill of Materials) */}
                <Route path="bom" element={<BOMPage />} />
                
                {/* Users (Admin only) */}
                <Route path="users" element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersPage />
                  </ProtectedRoute>
                } />
                
                {/* Settings */}
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;