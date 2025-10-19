import { useState } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';

import ProtectedRoute from '@/routes/ProtectedRoute'; 

import { RoleName } from '@/enums/RoleName'; 

import AuthLayout from '@/features/authentication/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import LoginPage from '@/features/authentication/pages/LoginPage';
import RegisterPage from '@/features/authentication/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';



import CustomerStatusPage from '@/features/customer/pages/StatusPage';


const DashboardPage = () => <div>Generic Dashboard</div>;
const AdminRulesPage = () => <div>Admin Rules Page</div>;
const AdminBpoPage = () => <div>Admin BPO Page</div>;
const AdminLogsPage = () => <div>Admin Logs Page</div>;
const CustomerPaymentsPage = () => <div>Customer Payments Page</div>;
const CustomerHelpPage = () => <div>Customer Help Page</div>;
const BpoTasksPage = () => <div>BPO Tasks Page</div>;
const BpoCallsPage = () => <div>BPO Calls Page</div>;





function App() {
  return (
    <ThemeProvider>
      <Routes>

          <Route element={<DashboardLayout />}>
            
            <Route path="/login" element={<AuthLayout formType="login"><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout formType="register"><RegisterPage /></AuthLayout>} />

            <Route path="/" element={<Navigate to="/customer/status" replace />} />


            <Route path="/admin/dashboard" element={<ProtectedRoute role={RoleName.ADMIN}><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin/rules" element={<ProtectedRoute role={RoleName.ADMIN}><AdminRulesPage /></ProtectedRoute>} />
            <Route path="/admin/bpo" element={<ProtectedRoute role={RoleName.ADMIN}><AdminBpoPage /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute role={RoleName.ADMIN}><AdminLogsPage /></ProtectedRoute>} />


            <Route path="/customer/status" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerStatusPage /></ProtectedRoute>} />
            <Route path="/customer/payments" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerPaymentsPage /></ProtectedRoute>} />
            <Route path="/customer/help" element={<ProtectedRoute role={RoleName.CUSTOMER}><CustomerHelpPage /></ProtectedRoute>} />


            <Route path="/bpo/tasks" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoTasksPage /></ProtectedRoute>} />
            <Route path="/bpo/calls" element={<ProtectedRoute role={RoleName.BPO_AGENT}><BpoCallsPage /></ProtectedRoute>} />


            <Route path="*" element={<NotFoundPage />} />
          </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App