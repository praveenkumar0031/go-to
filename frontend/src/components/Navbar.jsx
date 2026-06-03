import React from 'react';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar, user }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U');

  return (
    <header className={`h-20 border-b flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 backdrop-blur-md transition-all duration-300 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl transition-all duration-200 ${isDark ? 'text-yellow-400 hover:bg-slate-800 border border-slate-800' : 'text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all duration-200 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-600/20">
            {initial}
          </div>
          <span className={`hidden sm:inline text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {user?.name || user?.username || 'User'}
          </span>
        </div>

        <div className={`w-px h-6 mx-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        <button
          onClick={handleLogout}
          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;