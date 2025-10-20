import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';

import ProtectedRoute from '@/routes/ProtectedRoute'; 
import { RoleName } from '@/enums/RoleName'; 

// --- Layouts ---
import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout'; // <-- Your main layout

// --- UI ---
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // For Suspense

// --- Lazy-load ALL pages ---

// Auth
const LoginPage = lazy(() => import('@/features/authentication/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/authentication/pages/RegisterPage'));

// Customer
const CustomerStatusPage = lazy(() => import('@/features/customer/pages/StatusPage'));
// (Placeholders for pages we haven't built - pointing to NotFound for now)
const CustomerPaymentsPage = lazy(() => import('@/pages/NotFoundPage')); 
const CustomerHelpPage = lazy(() => import('@/pages/NotFoundPage')); 

// Admin
// (Placeholders for pages we haven't built - pointing to NotFound for now)
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage')); 
const AdminBpoPage = lazy(() => import('@/pages/NotFoundPage')); 
const AdminLogsPage = lazy(() => import('@/pages/NotFoundPage')); 
// --- This is the REAL page we just built ---
const AdminRulesPage = lazy(() => import('@/features/admin/pages/RulesManagementPage')); 

// BPO
// (Placeholders for pages we haven't built - pointing to NotFound for now)
const BpoTasksPage = lazy(() => import('@/pages/NotFoundPage')); 
const BpoCallsPage = lazy(() => import('@/pages/NotFoundPage')); 

// General
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingSpinner text="Loading..." isFullScreen />}>
        <Routes>

          {/* --- Main Route Wrapper with DashboardLayout --- */}
          <Route element={<DashboardLayout />}>
            
            {/* Auth Routes */}
            <Route path="/login" element={<AuthLayout formType="login"><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout formType="register"><RegisterPage /></AuthLayout>} />

            {/* Root Redirect */}
            <Route path="/" element={<Navigate to="/customer/status" replace />} />

            {/* Admin Routes (FIXED: using role={...}) */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role={RoleName.ADMIN}><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/rules" element={<ProtectedRoute role={RoleName.ADMIN}><AdminRulesPage /></ProtectedRoute>} />
            <Route path="/admin/bpo" element={<ProtectedRoute role={RoleName.ADMIN}><AdminBpoPage /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute role={RoleName.ADMIN}><AdminLogsPage /></ProtectedRoute>} />

            {/* Customer Routes (FIXED: using role={...}) */}
            <Route path="/customer/status" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerStatusPage /></ProtectedRoute>} />
            <Route path="/customer/payments" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerPaymentsPage /></ProtectedRoute>} />
            <Route path="/customer/help" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerHelpPage /></ProtectedRoute>} />

            {/* BPO Routes (FIXED: using role={...}) */}
            <Route path="/bpo/tasks" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoTasksPage /></ProtectedRoute>} />
            <Route path="/bpo/calls" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoCallsPage /></ProtectedRoute>} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
            
          </Route>
          
        </Routes>
      </Suspense>
    </ThemeProvider>
  )
}

export default App