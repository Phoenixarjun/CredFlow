import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Users, DollarSign, BarChart, ChevronLeft, ChevronRight, Shield, Activity } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { RoleName } from '@/enums/RoleName'; // <-- Import our RoleName enum

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const location = useLocation();

    const sidebarLinks = {
        [RoleName.ADMIN]: [
            { path: '/admin/dashboard', label: 'Dashboard', icon: <Home size={20} />, badge: null },
            { path: '/admin/rules', label: 'Rules Engine', icon: <Settings size={20} />, badge: 'AI' },
            { path: '/admin/bpo', label: 'BPO Tasks', icon: <Users size={20} />, badge: '12' },
            { path: '/admin/logs', label: 'Analytics', icon: <BarChart size={20} />, badge: null },
            { path: '/admin/security', label: 'Security', icon: <Shield size={20} />, badge: null },
        ],
        [RoleName.CUSTOMER]: [
            { path: '/customer/status', label: 'Account Status', icon: <Home size={20} />, badge: null },
            { path: '/customer/payments', label: 'Payments', icon: <DollarSign size={20} />, badge: '2' },
            { path: '/customer/help', label: 'Support', icon: <Settings size={20} />, badge: null },
        ],
        [RoleName.BPO_AGENT]: [ 
            { path: '/bpo/tasks', label: 'Task Queue', icon: <Home size={20} />, badge: '8' },
            { path: '/bpo/calls', label: 'Call Logs', icon: <Users size={20} />, badge: null },
            { path: '/bpo/performance', label: 'Performance', icon: <BarChart size={20} />, badge: null },
        ],
    };

    const links = sidebarLinks[user?.roleName] || [];

    const getRoleColor = (role) => {
        const colors = {
            [RoleName.ADMIN]: 'from-purple-500 to-pink-500',
            [RoleName.CUSTOMER]: 'from-blue-500 to-cyan-500',
            [RoleName.BPO_AGENT]: 'from-green-500 to-emerald-500' // <-- FIX: Key changed
        };
        return colors[role] || 'from-gray-500 to-gray-600';
    };

    return (
        <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-500 z-40 ${
                isCollapsed ? 'w-20' : 'w-64'
            } ${theme === 'dark' 
                ? 'bg-gray-900/80 border-r border-gray-700' 
                : 'bg-white/80 border-r border-blue-100'
            } backdrop-blur-lg hidden md:block`} // <-- Added 'hidden md:block' to work with App.jsx
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`absolute -right-3 top-6 p-1 rounded-full border transition-all duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' 
                        : 'bg-white border-blue-200 hover:bg-blue-50'
                }`}
            >
                {isCollapsed ? 
                    <ChevronRight size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} /> : 
                    <ChevronLeft size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                }
            </button>

            <div className="p-6">
                {!isCollapsed && (
                    <div className={`mb-8 p-4 rounded-xl transition-all duration-300 ${
                        theme === 'dark' 
                            ? 'bg-gray-800/50 border border-gray-700' 
                            : 'bg-blue-50/50 border border-blue-200'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoleColor(user?.roleName)}`}>
                                <Users size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.fullName}</p>
                                <p className="text-xs opacity-60 capitalize">{user?.roleName?.toLowerCase()}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="space-y-2">
                    {links.map(link => {
                        const isActive = location.pathname.startsWith(link.path);
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center rounded-xl p-3 transition-all duration-300 group relative ${
                                    isActive
                                        ? theme === 'dark'
                                            ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10'
                                            : 'bg-blue-500/10 text-blue-600 shadow-lg shadow-blue-500/20'
                                        : theme === 'dark'
                                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                            >
                                <div className="flex items-center">
                                    <span className={`transition-transform duration-300 group-hover:scale-110 ${
                                        isCollapsed ? '' : 'mr-3'
                                    }`}>
                                        {link.icon}
                                    </span>
                                    {!isCollapsed && (
                                        <span className="font-medium">{link.label}</span>
                                    )}
                                </div>
                                
                                {link.badge && !isCollapsed && (
                                    <span className={`px-2 py-1 text-xs rounded-full transition-all duration-300 ${
                                        isActive
                                            ? theme === 'dark'
                                                ? 'bg-blue-400/20 text-blue-300'
                                                : 'bg-blue-500/20 text-blue-600'
                                            : theme === 'dark'
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {link.badge}
                                    </span>
                                )}

                                {isActive && (
                                    <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r ${
                                        theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                                    }`}></div>
                                )}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                                        {link.label}
                                        {link.badge && ` (${link.badge})`}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {!isCollapsed && (
                    <div className={`mt-8 p-4 rounded-xl transition-all duration-300 ${
                        theme === 'dark' 
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                            : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200'
                    }`}>
                        <div className="text-center">
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
                                <Activity size={16} className="text-white" />
                            </div>
                            <p className="text-xs font-medium">System Status</p>
                            <div className="flex items-center justify-center mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <p className="text-xs opacity-60">All Systems Operational</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;