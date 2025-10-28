import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home, Settings, Users, DollarSign, BarChart, ChevronLeft, ChevronRight,
  Shield, Activity, List, Search, Layers, Mail, Phone, CheckSquare, BarChart2
} from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { useAuth } from '@/features/authentication/context/AuthContext'
import { RoleName } from '@/enums/RoleName'
import { Heading } from '@radix-ui/themes'

const allLinks = {
  [RoleName.ADMIN]: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <Home size={20} />, section: 'Main' },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart size={20} />, section: 'Main' },
    { path: '/admin/users', label: 'User Management', icon: <Users size={20} />, section: 'Management' },
    { path: '/admin/customer-lookup', label: 'Customer Lookup', icon: <Search size={20} />, section: 'Management' },
    { path: '/admin/rules', label: 'Rules Engine', icon: <Settings size={20} />, section: 'Configuration' },
    { path: '/admin/plans', label: 'Plan Management', icon: <Layers size={20} />, section: 'Configuration' },
    { path: '/admin/templates', label: 'Email Templates', icon: <Mail size={20} />, section: 'Configuration' },
    { path: '/admin/bpo', label: 'BPO Overview', icon: <Users size={20} />, section: 'Operations' },
    { path: '/admin/logs/dunning', label: 'Dunning Logs', icon: <List size={20} />, section: 'System Logs' },
    { path: '/admin/logs/notifications', label: 'Notification Logs', icon: <List size={20} />, section: 'System Logs' },
  ],
  [RoleName.CUSTOMER]: [
    { path: '/customer/status', label: 'Account Status', icon: <Home size={20} /> },
    { path: '/customer/payments', label: 'Payments', icon: <DollarSign size={20} /> },
    { path: '/customer/plans', label: 'Browse Plans', icon: <Layers size={20} /> },
  ],
  [RoleName.BPO_AGENT]: [
    { path: '/bpo/tasks', label: 'Task Queue', icon: <CheckSquare size={20} /> },
    { path: '/bpo/calls', label: 'Call Logs', icon: <Phone size={20} /> },
    { path: '/bpo/performance', label: 'My Performance', icon: <BarChart2 size={20} /> },
  ],
}

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const location = useLocation()

  const links = allLinks[user?.roleName] || []
  const groupedLinks = links.reduce((acc, link) => {
    const section = link.section || 'General'
    if (!acc[section]) acc[section] = []
    acc[section].push(link)
    return acc
  }, {})

  const getRoleColor = role => {
    const colors = {
      [RoleName.ADMIN]: 'from-purple-500 to-pink-500',
      [RoleName.CUSTOMER]: 'from-blue-500 to-cyan-500',
      [RoleName.BPO_AGENT]: 'from-green-500 to-emerald-500',
    }
    return colors[role] || 'from-gray-500 to-gray-600'
  }

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${theme === 'dark'
        ? 'bg-gray-900/80 border-r border-gray-700'
        : 'bg-white/80 border-r border-blue-100'
      } backdrop-blur-lg hidden md:flex flex-col`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={`absolute -right-3 top-6 p-1 rounded-full border transition-all duration-300 z-50 ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300'
            : 'bg-white border-blue-200 hover:bg-blue-50 text-gray-600'
        }`}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <style jsx>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(147, 197, 253, 0.5)'};
          border-radius: 3px;
          transition: background 0.2s;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(107, 114, 128, 0.8)' : 'rgba(96, 165, 250, 0.8)'};
        }
        
        /* For Firefox */
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${theme === 'dark' 
            ? 'rgba(75, 85, 99, 0.5) transparent' 
            : 'rgba(147, 197, 253, 0.5) transparent'};
        }
      `}</style>

      <div className="p-4 pt-6 flex flex-col h-full overflow-y-auto sidebar-scroll">
        {!isCollapsed && user && (
          <div className={`mb-6 p-3 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-blue-50/50 border border-blue-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoleColor(user.roleName)} flex-shrink-0`}>
                <Users size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {user.fullName}
                </p>
                <p className={`text-xs opacity-70 capitalize ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.roleName?.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-1 flex-grow">
          {Object.entries(groupedLinks).map(([section, sectionLinks], sectionIndex) => (
            <div key={section} className={sectionIndex > 0 ? 'mt-4 pt-2 border-t border-gray-200 dark:border-gray-700' : ''}>
              {!isCollapsed && section !== 'General' && (
                <Heading as="h3" size="1" color="gray" highContrast className="px-3 py-1 mb-1 uppercase tracking-wider text-xs font-semibold">
                  {section}
                </Heading>
              )}
              {sectionLinks.map(link => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path) && link.path.length > 1)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center rounded-lg p-3 transition-all duration-200 group relative ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-blue-500/15 text-blue-300'
                          : 'bg-blue-500/10 text-blue-700 font-medium'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? link.label : undefined}
                  >
                    <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? '' : 'mr-3'}`}>
                      {link.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm flex-1">{link.label}</span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none delay-150">
                        {link.label}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {!isCollapsed && (
          <div className={`mt-auto mb-2 p-3 rounded-xl ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
              : 'bg-gradient-to-br from-blue-50/50 to-white/50 border border-blue-200/50'
          }`}>
            <div className="text-center">
              <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <Activity size={12} className="text-white" />
              </div>
              <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                System Status
              </p>
              <div className="flex items-center justify-center mt-0.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                <p className={`text-xs opacity-70 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Operational
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar