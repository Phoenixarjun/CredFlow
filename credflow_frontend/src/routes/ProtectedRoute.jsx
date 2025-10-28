import React from 'react';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProtectedRoute = ({ children, role }) => { // Role prop is optional now
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Handle loading state
    if (loading) {
        // Consider a full-screen spinner for better UX during initial load
        return <LoadingSpinner text="Authenticating..." fullscreen={true} />;
    }

    // 2. Handle not authenticated state
    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // --- 3. FIX: Only check role IF a role prop was provided ---
    if (role && user.roleName !== role) {
        // User is logged in, but doesn't have the specific required role.
        // Redirect to a relevant page (e.g., their default dashboard or an 'unauthorized' page).
        // Redirecting to login might be confusing if they are already logged in.
        // For simplicity now, we'll still redirect to login, but consider an unauthorized page later.
        console.warn(`Role mismatch: User has role ${user.roleName}, but required ${role}. Redirecting.`);
        // You might want to redirect to a different page like '/' or '/unauthorized'
        return <Navigate to="/login" state={{ from: location }} replace />; // Or navigate('/')
    }
    // --- End Fix ---


    // 4. User is authenticated and (if role was required) has the correct role
    return children;
};

export default ProtectedRoute;