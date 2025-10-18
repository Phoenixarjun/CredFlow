import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/authentication/context/AuthContext'
import { useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading } = useAuth()
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export default ProtectedRoute