import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/services/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            // MOCK: Check for a mock user in localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } else {
                // If you were using tokens, you would clear it here
                // localStorage.removeItem('token');
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAuthSuccess = (token) => {
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decodedUser = jwtDecode(token);
        const userData = { email: decodedUser.sub, role: decodedUser.role, name: decodedUser.name };
        setUser(userData);

        switch (userData.role) {
            case 'ADMIN':
                navigate('/admin/dashboard');
                break;
            case 'CUSTOMER':
                navigate('/customer/status');
                break;
            case 'BPO':
                navigate('/bpo/tasks');
                break;
            default:
                navigate('/');
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            // --- MOCK LOGIN ---
            // This section simulates a login without a backend.
            // It will be replaced with the API call later.
            console.log(`Simulating login for: ${email}`);

            let role = 'CUSTOMER';
            let name = 'Mock Customer';
            if (email.startsWith('admin')) {
                role = 'ADMIN';
                name = 'Mock Admin';
            } else if (email.startsWith('bpo')) {
                role = 'BPO';
                name = 'Mock BPO Agent';
            }

            const mockUser = { email, role, name };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser)); // Store mock user

            // Redirect based on role
            switch (role) {
                case 'ADMIN': navigate('/admin/dashboard'); break;
                case 'CUSTOMER': navigate('/customer/status'); break;
                case 'BPO': navigate('/bpo/tasks'); break;
                default: navigate('/'); break;
            }
            // --- END MOCK LOGIN ---
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            await apiClient.post('/auth/register', userData);
            navigate('/login'); 
        } finally {
            setLoading(false);
        }
    };
    
    const logout = () => {
        setUser(null);
        // MOCK: Remove mock user from storage
        localStorage.removeItem('user');
        navigate('/login');
    };

    const value = { user, loading, login, logout, register };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);