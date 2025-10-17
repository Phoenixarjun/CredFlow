import React from 'react';
import { useTheme } from '@/context/ThemeProvider';

const Footer = () => {
    const { theme } = useTheme();

    return (
        <footer
            className={`py-8 mt-auto transition-all duration-500 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700' 
                    : 'bg-gradient-to-t from-blue-50 to-white border-t border-blue-100'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center lg:items-start space-y-3">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                                theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                            }`}></div>
                            <span className="text-2xl font-bold credflow-gradient bg-gradient-to-r from-blue-500 to-purple-600">
                                CredFlow
                            </span>
                        </div>
                        <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Intelligent Telecom Payment Recovery
                        </p>
                        <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                            © 2025 CredFlow. All rights reserved.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                        <div className="flex space-x-6">
                            <a 
                                href="/terms" 
                                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                    theme === 'dark' 
                                        ? 'text-gray-400 hover:text-blue-400' 
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                Terms
                            </a>
                            <a 
                                href="/privacy" 
                                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                    theme === 'dark' 
                                        ? 'text-gray-400 hover:text-blue-400' 
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                Privacy
                            </a>
                            <a 
                                href="/support" 
                                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                    theme === 'dark' 
                                        ? 'text-gray-400 hover:text-blue-400' 
                                        : 'text-gray-600 hover:text-blue-600'
                                }`}
                            >
                                Support
                            </a>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a href="#" className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 hover:bg-blue-500' 
                                    : 'bg-blue-100 hover:bg-blue-500'
                            }`}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="#" className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 hover:bg-blue-500' 
                                    : 'bg-blue-100 hover:bg-blue-500'
                            }`}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className={`mt-6 pt-6 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-blue-100'
                }`}>
                    <p className={`text-center text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                        Powered by AI • Built for Telecom Excellence • Secure & Reliable
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;