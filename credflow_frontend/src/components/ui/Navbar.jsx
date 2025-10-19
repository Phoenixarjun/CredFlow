import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Home, Settings, Users, DollarSign, BarChart, LogOut, Bell, User, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { RoleName } from '@/enums/RoleName'; // <-- Import our RoleName enum

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const navLinks = {

        [RoleName.ADMIN]: [ 
            { path: '/admin/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
            { path: '/admin/rules', label: 'Rules', icon: <Settings size={18} /> },
            { path: '/admin/bpo', label: 'BPO Tasks', icon: <Users size={18} /> },
            { path: '/admin/logs', label: 'Logs', icon: <BarChart size={18} /> },
        ],
        [RoleName.CUSTOMER]: [
            { path: '/customer/status', label: 'Status', icon: <Home size={18} /> },
            { path: '/customer/payments', label: 'Payments', icon: <DollarSign size={18} /> },
            { path: '/customer/help', label: 'Help', icon: <Settings size={18} /> },
        ],
        [RoleName.BPO_AGENT]: [ 
            { path: '/bpo/tasks', label: 'Tasks', icon: <Home size={18} /> },
            { path: '/bpo/calls', label: 'Call Logs', icon: <Users size={18} /> },
        ],
    };

    const links = navLinks[user?.roleName] || [];

    return (
        <nav
            className={`fixed top-0 w-full py-2 z-50 transition-all duration-500 backdrop-blur-lg ${
                theme === 'dark' 
                    ? 'bg-gray-900/80 border-b border-gray-700' 
                    : 'bg-white/80 border-b border-blue-100'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <img src="/logo.png" alt="CredFlow Logo" className="h-14 self-center"/> 
                    
                    {!isAuthPage && user && (
                        <div className="hidden md:flex items-center space-x-1">
                            {links.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        location.pathname.startsWith(link.path)
                                            ? theme === 'dark'
                                                ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
                                                : 'bg-blue-500/10 text-blue-600 shadow-lg shadow-blue-500/20'
                                            : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                >
                                    <span className="mr-2">{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center space-x-3">
                        <button
                            className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                                theme === 'dark' 
                                    ? 'hover:bg-gray-800 text-gray-300' 
                                    : 'hover:bg-blue-50 text-gray-600'
                            }`}
                        >
                            {!isAuthPage && user && <Bell size={20} />}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                                theme === 'dark' 
                                    ? 'hover:bg-gray-800 text-yellow-400' 
                                    : 'hover:bg-blue-50 text-gray-600'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {!isAuthPage && user && (<div className="relative hidden md:block">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                                    theme === 'dark' 
                                        ? 'hover:bg-gray-800' 
                                        : 'hover:bg-blue-50'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${
                                    theme === 'dark' 
                                        ? 'bg-blue-500/20' 
                                        : 'bg-blue-500/10'
                                }`}>
                                    <User size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <span className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {user?.fullName || 'User'}
                                </span>
                                <ChevronDown size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                            </button>

                            {isProfileOpen && (
                                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 transition-all duration-300 ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border border-gray-700' 
                                        : 'bg-white border border-gray-200'
                                }`}>
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium">{user?.fullName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.roleName?.toLowerCase()}</p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>)}
                    </div>

                    <div className={`md:hidden flex items-center space-x-2 ${isAuthPage ? 'hidden' : ''}`}>
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg ...`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 rounded-lg ...`}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && !isAuthPage && (
                <div className={`md:hidden ...`}>
                    <div className="px-4 py-4 space-y-2">
                        {links.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center ...`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="mr-3">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                        
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium">{user?.fullName}</p>
                                    <p className="text-xs ... capitalize">{user?.roleName?.toLowerCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="flex items-center w-full px-4 py-3 text-red-600 ..."
                            >
                                <LogOut size={18} className="mr-3" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;