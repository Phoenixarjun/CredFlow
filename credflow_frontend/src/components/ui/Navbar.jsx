import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, LogOut, Bell, User as UserIcon, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuth } from '@/features/authentication/context/AuthContext';

const Navbar = ({ toggleMobileSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const profileRef = useRef(null);

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full h-16 z-50 transition-colors duration-300 backdrop-blur-lg flex items-center ${
                theme === 'dark'
                    ? 'bg-gray-900/80 border-b border-gray-700/80'
                    : 'bg-white/80 border-b border-blue-100/80'
            }`}
        >
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-full">
                    <div className="flex items-center">
                        {!isAuthPage && user && (
                            <button
                                onClick={toggleMobileSidebar}
                                className={`mr-2 p-2 rounded-lg md:hidden ${
                                    theme === 'dark' ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-blue-50'
                                }`}
                                aria-label="Toggle sidebar"
                            >
                                <Menu size={24} />
                            </button>
                        )}
                        <Link to="/" className="flex-shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
                            <img src="/logo.png" alt="CredFlow Logo" className="h-14 w-auto"/>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {!isAuthPage && user && (
                             <button
                                 className={`p-2 rounded-lg transition-colors duration-200 relative ${
                                     theme === 'dark'
                                         ? 'text-gray-300 hover:bg-gray-700/50'
                                         : 'text-gray-600 hover:bg-blue-50'
                                 }`}
                                 aria-label="Notifications"
                             >
                                 <Bell size={20} />
                                 <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white dark:ring-gray-900"></span>
                             </button>
                         )}

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                                theme === 'dark'
                                    ? 'text-yellow-400 hover:bg-gray-700/50'
                                    : 'text-gray-600 hover:bg-blue-50'
                            }`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {!isAuthPage && user && (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    aria-haspopup="true"
                                    aria-expanded={isProfileOpen}
                                    className={`flex items-center space-x-1.5 sm:space-x-2 pl-2 pr-1 sm:px-3 py-1.5 rounded-lg transition-colors duration-200 ${
                                        theme === 'dark'
                                            ? 'hover:bg-gray-700/50'
                                            : 'hover:bg-blue-50'
                                    }`}
                                >
                                    <div className={`p-1 rounded-md ${
                                        theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-500/10 text-blue-600'
                                    }`}>
                                        <UserIcon size={16} />
                                    </div>
                                    <span className={`hidden sm:inline text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {user.fullName || 'User'}
                                    </span>
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                </button>

                                {isProfileOpen && (
                                    <div
                                     role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                                     className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 transition-all ease-out duration-100 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 border border-gray-700'
                                            : 'bg-white border border-gray-200'
                                    } ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} >
                                        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{user.fullName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.roleName?.replace('_', ' ').toLowerCase()}</p>
                                        </div>
                                        <button
                                            role="menuitem"
                                            onClick={() => { logout(); setIsProfileOpen(false); }}
                                            className={`flex items-center w-full px-3 py-2 text-sm transition-colors duration-200 ${
                                                theme === 'dark'
                                                ? 'text-red-400 hover:bg-red-500/10'
                                                : 'text-red-600 hover:bg-red-50'
                                            }`}
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;