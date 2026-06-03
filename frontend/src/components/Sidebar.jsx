import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Settings, BarChart2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import GotoLogo from './common/GotoLogo';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
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
        fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static border-r flex flex-col
        ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        ${isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        {/* Header/Logo Section */}
        <div className={`h-20 flex items-center justify-center border-b border-inherit transition-all duration-300`}>
          <div className="flex items-center justify-center overflow-hidden">
            <GotoLogo size="" />
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden absolute right-4 p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar transition-all duration-300">
          {links.map((link) => {
            const Icon = link.icon;
            
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                  ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}
                `}
                title={isCollapsed ? link.name : ''}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
                  {link.name}
                </span>
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl hidden lg:block">
                    {link.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer/Pro Tip Section */}
        <div className={`p-4 border-t border-inherit transition-all duration-300 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <div className={`rounded-xl transition-all duration-300 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} ${isCollapsed ? 'lg:p-2 lg:flex lg:justify-center' : 'p-4'}`}>
            <div className={`transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pro Tip</p>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Use custom aliases for memorable links.</p>
            </div>
            <div className={`hidden ${isCollapsed ? 'lg:block' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Settings size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full border items-center justify-center z-50 transition-all duration-300
            ${isDark ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-md'}
          `}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;