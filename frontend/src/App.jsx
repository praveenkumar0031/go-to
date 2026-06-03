import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Components (Public)
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import CreateUrl from './pages/CreateUrl';
import ForgotPassword from './components/user/ForgetPassword';

// Main Layout (Protected Routes)
import DashboardLayout from './components/layouts/DashboardLayout';

// Page Components (Protected)
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Analytics from './pages/Analytics';
import QrCodePage from './pages/QrCodePage';
import NotFound from './pages/NotFound';
/**
 * App Component
 * Main routing component with protected and public routes
 * 
 * Public Routes (Auth):
 * - /login, /signup, /forget
 * 
 * Protected Routes (DashboardLayout wrapper):
 * - / (Landing Page)
 * - /dashboard (Dashboard with URL input & cards)
 * - /history (History table view)
 * - /analytics/:id (Detailed analytics for specific URL)
 */
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES (No Layout) ==================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forget" element={<ForgotPassword />} />
      <Route path="/" element={<Landing />} />
      <Route path="/expired" element={<NotFound />} />

      {/* ==================== PROTECTED ROUTES (DashboardLayout) ==================== */}
      {user ? (
        <Route element={<DashboardLayout user={user} />}>
          

          {/* Dashboard - Main page with URL input & cards grid */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Create URL */}
          <Route path="/dashboard/create" element={<CreateUrl />} />

          {/* History - Full data table of all URLs */}
          <Route path="/history" element={<History />} />

          {/* Analytics - Detailed metrics for specific URL */}
          <Route path="/analytics/:id" element={<Analytics />} />
          
          {/* QR Code Page */}
          <Route path="/qr/:shortCode" element={<QrCodePage />} />

          {/* Catch all protected routes */}
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default App;