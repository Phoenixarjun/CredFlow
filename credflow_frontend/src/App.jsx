import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/features/authentication/context/AuthContext'; // <-- Import AuthProvider
import { Toaster } from 'sonner'; // <-- Import Toaster

import ProtectedRoute from '@/routes/ProtectedRoute';
import { RoleName } from '@/enums/RoleName';

import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout'; // Layout wraps everything

import LoadingSpinner from '@/components/common/LoadingSpinner'; // <-- Import LoadingSpinner

// --- Lazy Load Components ---
// Auth
const LoginPage = lazy(() => import('@/features/authentication/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/authentication/pages/RegisterPage'));

// Customer
const CustomerStatusPage = lazy(() => import('@/features/customer/pages/StatusPage'));
const CustomerPaymentsPage = lazy(() => import('@/features/customer/pages/CustomerPaymentsPage'));
const CustomerPlansPage = lazy(() => import('@/features/customer/pages/PlanMarketplacePage'));
const CustomerHelpPage = lazy(() => import('@/pages/NotFoundPage')); // Consider creating a real help page

// Admin
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminBpoPage = lazy(() => import('@/features/admin/pages/AdminBpoPage'));
const AdminRulesPage = lazy(() => import('@/features/admin/pages/RulesManagementPage'));
const AdminPlansPage = lazy(() => import('@/features/admin/pages/AdminPlansPage'));
const AdminAnalyticsPage = lazy(() => import('@/features/admin/pages/AdminAnalyticsPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const AdminCustomerSearchPage = lazy(() => import('@/features/admin/pages/AdminCustomerSearchPage'));
const AdminDunningLogPage = lazy(() => import('@/features/admin/pages/AdminDunningLogPage'));
const AdminNotificationLogPage = lazy(() => import('@/features/admin/pages/AdminNotificationLogPage'));
const AdminTemplatesPage = lazy(() => import('@/features/admin/pages/AdminTemplatesPage'));


// BPO
const BpoTasksPage = lazy(() => import('@/features/bpo/pages/BpoTaskQueue'));
const BpoCallsPage = lazy(() => import('@/features/bpo/pages/BpoCallLogsPage'));
const BpoPerformancePage = lazy(() => import('@/features/bpo/pages/BpoPerformancePage'));

// Profile
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage')); // <-- Import Profile Page

// General
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
// --- End Lazy Load ---

function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* <-- Added AuthProvider */}
        <Suspense fallback={<LoadingSpinner text="Loading page..." fullscreen={true} />}> {/* <-- Added Suspense */}
          <Routes>
            {/* DashboardLayout wraps ALL routes */}
            <Route element={<DashboardLayout />}>

              {/* Public Auth Routes (using AuthLayout within DashboardLayout) */}
              <Route path="/login" element={<AuthLayout formType="login"><LoginPage /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout formType="register"><RegisterPage /></AuthLayout>} />

              {/* Root Redirect */}
              {/* Redirect logic might need adjustment depending on auth state if DashboardLayout always shows */}
              <Route path="/" element={<Navigate to="/customer/status" replace />} />

              {/* --- Profile Route (Accessible to all logged-in roles) --- */}
              {/* ProtectedRoute here assumes it checks auth and optionally role */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              {/* --------------------------------------------------------- */}

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute role={RoleName.ADMIN}><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/rules" element={<ProtectedRoute role={RoleName.ADMIN}><AdminRulesPage /></ProtectedRoute>} />
              <Route path="/admin/bpo" element={<ProtectedRoute role={RoleName.ADMIN}><AdminBpoPage /></ProtectedRoute>} />
              <Route path="/admin/plans" element={<ProtectedRoute role={RoleName.ADMIN}><AdminPlansPage /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute role={RoleName.ADMIN}><AdminAnalyticsPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute role={RoleName.ADMIN}><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/customer-lookup" element={<ProtectedRoute role={RoleName.ADMIN}><AdminCustomerSearchPage /></ProtectedRoute>} />
              <Route path="/admin/logs/dunning" element={<ProtectedRoute role={RoleName.ADMIN}><AdminDunningLogPage /></ProtectedRoute>} />
              <Route path="/admin/logs/notifications" element={<ProtectedRoute role={RoleName.ADMIN}><AdminNotificationLogPage /></ProtectedRoute>} />
              <Route path="/admin/templates" element={<ProtectedRoute role={RoleName.ADMIN}><AdminTemplatesPage /></ProtectedRoute>} />

              {/* Customer Routes */}
              <Route path="/customer/status" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerStatusPage /></ProtectedRoute>} />
              <Route path="/customer/payments" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerPaymentsPage /></ProtectedRoute>} />
              <Route path="/customer/plans" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerPlansPage /></ProtectedRoute>} />
              <Route path="/customer/help" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerHelpPage /></ProtectedRoute>} />

              {/* BPO Routes */}
              <Route path="/bpo/tasks" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoTasksPage /></ProtectedRoute>} />
              <Route path="/bpo/calls" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoCallsPage /></ProtectedRoute>} />
              <Route path="/bpo/performance" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoPerformancePage /></ProtectedRoute>} />

              {/* 404 Not Found within authenticated layout */}
              <Route path="*" element={<NotFoundPage />} />

            </Route> {/* End DashboardLayout */}
          </Routes>
        </Suspense>
        <Toaster richColors position="top-right" /> {/* <-- Added Toaster */}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;