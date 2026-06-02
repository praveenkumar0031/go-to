import React from 'react';

/**
 * GotoLogo Component
 * Displays the premium "Goto" logo with a modern design
 * Features a bold sans-serif font with accent color on "go"
 */
const GotoLogo = ({ size = 'md', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const isCompact = variant === 'compact';

  return (
    <div className="flex items-center gap-1">
      <div className={`font-bold tracking-tight ${sizeClasses[size]} flex items-baseline`}>
        <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">
          Go
        </span>
        <span className="text-slate-900 dark:text-white">
          to
        </span>
        {!isCompact && (
          <>
            <svg
              className="w-1.5 h-1.5 mx-0.5 stroke-indigo-600 dark:stroke-indigo-400"
              viewBox="0 0 24 24"
            >
              <path d="M13 5l7 7m0 0l-7 7m7-7H6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </>
        )}
      </div>
    </div>
  );
};

export default GotoLogo;
