import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';

import ProtectedRoute from '@/routes/ProtectedRoute';
import { RoleName } from '@/enums/RoleName';

import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';


// Auth
const LoginPage = lazy(() => import('@/features/authentication/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/authentication/pages/RegisterPage'));

// Customer
const CustomerStatusPage = lazy(() => import('@/features/customer/pages/StatusPage'));
const CustomerPaymentsPage = lazy(() => import('@/features/customer/pages/CustomerPaymentsPage')); 
const CustomerHelpPage = lazy(() => import('@/pages/NotFoundPage'));

// Admin
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminBpoPage = lazy(() => import('@/features/admin/pages/AdminBpoPage'));
const AdminLogsPage = lazy(() => import('@/pages/NotFoundPage')); 
const AdminRulesPage = lazy(() => import('@/features/admin/pages/RulesManagementPage')); 

// BPO
const BpoTasksPage = lazy(() => import('@/features/bpo/pages/BpoTaskQueue'));
const BpoCallsPage = lazy(() => import('@/features/bpo/pages/BpoCallLogsPage')); 

// General
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<DashboardLayout />}>
          
          <Route path="/login" element={<AuthLayout formType="login"><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout formType="register"><RegisterPage /></AuthLayout>} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/customer/status" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute role={RoleName.ADMIN}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/rules" element={<ProtectedRoute role={RoleName.ADMIN}><AdminRulesPage /></ProtectedRoute>} />
          <Route path="/admin/bpo" element={<ProtectedRoute role={RoleName.ADMIN}><AdminBpoPage /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute role={RoleName.ADMIN}><AdminLogsPage /></ProtectedRoute>} />

          {/* Customer Routes */}
          <Route path="/customer/status" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerStatusPage /></ProtectedRoute>} />
          <Route path="/customer/payments" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerPaymentsPage /></ProtectedRoute>} />
          <Route path="/customer/help" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerHelpPage /></ProtectedRoute>} />

          {/* BPO Routes */}
          <Route path="/bpo/tasks" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoTasksPage /></ProtectedRoute>} />
          {/* ** UPDATED this element ** */}
          <Route path="/bpo/calls" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoCallsPage /></ProtectedRoute>} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
          
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;