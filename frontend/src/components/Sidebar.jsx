import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Settings, BarChart2, X } from 'lucide-react';
import GotoLogo from './common/GotoLogo';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { isDark } = useTheme();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:w-64 border-r
        ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        ${isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-inherit">
          <div className="flex items-center gap-2">
            <GotoLogo size="sm" />
            <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Goto</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-inherit">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pro Tip</p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Use custom aliases to make your links more memorable.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;