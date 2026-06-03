import React from 'react';
import logoDark from '../../assets/goto.png';
import logoLight from '../../assets/gotol.png';

import { useTheme } from '../../context/ThemeContext';

/**
 * GotoLogo Component
 * Displays logo based on current theme
 */
const GotoLogo = ({ size = 'md' }) => {
  const { isDark } = useTheme();

  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div className="flex items-center">
      <img
        src={isDark ? logoDark : logoLight}
        alt="Goto Logo"
        className={`${heights[size]} w-auto object-contain transition-all duration-300`}
      />
    </div>
  );
};

export default GotoLogo;