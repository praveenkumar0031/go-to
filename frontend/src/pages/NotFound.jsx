import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center text-center p-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <h1 className="text-9xl font-bold text-indigo-600 dark:text-indigo-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className={`max-w-md mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Oops! The page you are looking for doesn't exist. It might have been moved or deleted.
      </p>
      
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
      >
        <Home size={18} /> Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;