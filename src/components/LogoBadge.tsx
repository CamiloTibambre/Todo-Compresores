import React from 'react';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  size = 'md',
  showSubtitle = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-[9px]',
    md: 'w-10 h-10 text-[11px]',
    lg: 'w-20 h-20 text-[16px]'
  };

  return (
    <div className={`relative flex items-center justify-center font-sans select-none ${className}`}>
      {/* Emblem Frame */}
      <div
        className={`${sizeMap[size]} bg-white rounded-lg border-2 border-[#ffd600] flex flex-col items-center justify-center relative overflow-hidden shadow-md`}
        style={{
          boxShadow: '0 0 10px rgba(255, 214, 0, 0.4), inset 0 0 0 1px #e52421'
        }}
      >
        {/* Lightning bolts in background */}
        <div className="absolute inset-0 flex items-center justify-between px-0.5 opacity-80 pointer-events-none">
          <svg className="w-2.5 h-4 text-[#ffd600] fill-current" viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <svg className="w-2.5 h-4 text-[#ffd600] fill-current" viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        {/* TCB Monogram */}
        <div className="relative z-10 flex items-center justify-center font-black leading-none">
          <span className="text-black font-extrabold tracking-tighter" style={{ fontSize: size === 'lg' ? '28px' : size === 'md' ? '14px' : '11px' }}>
            T
          </span>
          <span className="text-[#e52421] font-black -ml-0.5" style={{ fontSize: size === 'lg' ? '30px' : size === 'md' ? '15px' : '12px' }}>
            C
          </span>
          <span className="text-black font-extrabold -ml-0.5" style={{ fontSize: size === 'lg' ? '28px' : size === 'md' ? '14px' : '11px' }}>
            B
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="ml-3 text-left">
          <div className="font-extrabold text-sm tracking-tight text-white uppercase flex items-center gap-1.5">
            <span>TODO COMPRESORES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffd600] animate-pulse"></span>
          </div>
          <div className="text-[11px] text-[#ffd600] font-semibold tracking-wider">
            Y BOBINADOS • SUBA
          </div>
        </div>
      )}
    </div>
  );
};
