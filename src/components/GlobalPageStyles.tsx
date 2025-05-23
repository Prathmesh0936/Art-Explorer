
'use client';

import type React from 'react';

const GlobalPageStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .animation-delay-300 { animation-delay: 300ms; }
      .animation-delay-600 { animation-delay: 600ms; }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out forwards;
        opacity: 0; /* Start hidden */
      }
    `}</style>
  );
};

export default GlobalPageStyles;
