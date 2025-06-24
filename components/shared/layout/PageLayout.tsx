import React from 'react';

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function PageLayout({ children, className = '', contentClassName = '' }: PageLayoutProps): React.FC {
  return (
    <div className={`flex-1 bg-[#181825] ${className}`}>
      <div className={`flex-1 flex justify-center items-center p-8 bg-[#232336cc] rounded-[28px] border-[1.5px] border-[#F7931A] shadow-[0_8px_32px_0_rgba(0,0,0,0.18)] m-6 ${contentClassName}`}>
        {children}
      </div>
    </div>
};
}
