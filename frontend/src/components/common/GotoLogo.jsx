import React from 'react';
import logoImg from '../../assets/goto.png';

/**
 * GotoLogo Component
 * Displays the "Goto" logo using the brand image
 */
const GotoLogo = ({ size = 'md', variant = 'default' }) => {
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <div className="flex items-center">
      <img 
        src={logoImg} 
        alt="Goto Logo" 
        className={`${heights[size]} w-auto object-contain`}
      />
    </div>
  );
};

export default GotoLogo;
