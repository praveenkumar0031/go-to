import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar Component */}
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} user={user} />

        {/* Main Content Area */}
        <main className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar transition-all duration-300 ${isDark ? 'text-slate-50' : 'text-slate-900'}`}>
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;