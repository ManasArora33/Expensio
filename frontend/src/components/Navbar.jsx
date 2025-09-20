import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, LayoutDashboard, Receipt, MessageSquare, LogOut } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/expenses', label: 'Add Expenses', icon: <Receipt size={20} /> },
        { path: '/advice', label: 'Financial Advisor', icon: <MessageSquare size={20} /> },
    ];

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            toast.success('Logged out successfully!');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed. Please try again.');
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center cursor-pointer group"
                >
                    <DollarSign className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                        Expensio
                    </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                    {navLinks.map(link => (
                        location.pathname !== link.path && (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 text-sm transition-colors"
                            >
                                {React.cloneElement(link.icon, { size: 16 })}
                                <span>{link.label}</span>
                            </button>
                        )
                    ))}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center space-x-2 text-sm transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;