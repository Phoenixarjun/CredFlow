import LoginPage from './pages/LoginPage'
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeProvider';
import Navbar from './components/ui/Navbar';
import Sidebar from './components/ui/Sidebar';
import Footer from './components/ui/Footer';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';import ProtectedRoute from './routes/ProtectedRoute';
import { useState } from 'react';

const Layout = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1">
        {user && !isAuthPage && <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />}
        <main className={`flex flex-col flex-1 mt-16 transition-all duration-500 ${user && !isAuthPage 
            ? (isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''}`}>
          <div className={`flex-grow ${isAuthPage ? 'p-0' : 'p-4 md:p-6'}`}>
              <Outlet />
          </div>
          {!isAuthPage && <Footer />}
        </main>
      </div>
      </div>
  );
};

function App() {
  return (
    <Routes>
          <Route element={<ThemeProvider><Layout /></ThemeProvider>}>
            <Route path="/login" element={<AuthLayout formType="login"><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout formType="register"><RegisterPage /></AuthLayout>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/rules" element={<DashboardPage />} />
              <Route path="/admin/bpo" element={<DashboardPage />} />
              <Route path="/admin/logs" element={<DashboardPage />} />
              <Route path="/customer/status" element={<DashboardPage />} />
              <Route path="/customer/payments" element={<DashboardPage />} />
              <Route path="/customer/help" element={<DashboardPage />} />
              <Route path="/bpo/tasks" element={<DashboardPage />} />
              <Route path="/bpo/calls" element={<DashboardPage />} />
            </Route>
      </Route>
    </Routes>
  )
}

export default App
