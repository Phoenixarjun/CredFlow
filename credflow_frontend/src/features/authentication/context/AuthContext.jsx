import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '@/services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const loadUserFromToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Fetch the user profile from the backend
                    const response = await apiClient.get('/auth/profile');
                    
                    // **THE FIX**: Combine the profile (response.data) and the token
                    setUser({ ...response.data, token: token }); 

                } catch (error) {
                    console.error("Failed to load user from token:", error);
                    localStorage.removeItem('token'); // Clear the bad token
                    delete apiClient.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };

        loadUserFromToken();
    }, []); 

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { jwtToken, user: loggedInUser } = response.data;
        
        localStorage.setItem('token', jwtToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        
        // **THE FIX**: Combine the user object and the token
        const userWithToken = { ...loggedInUser, token: jwtToken };
        setUser(userWithToken);
        
        return userWithToken; // Return the combined object
    };

    const register = async (registerData) => {
        const response = await apiClient.post('/auth/register', registerData);
        const { jwtToken, user: registeredUser } = response.data;

        localStorage.setItem('token', jwtToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

        // **THE FIX**: Combine the user object and the token
        const userWithToken = { ...registeredUser, token: jwtToken };
        setUser(userWithToken);

        return userWithToken; // Return the combined object
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
    };

    const value = { user, loading, login, logout, register };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};