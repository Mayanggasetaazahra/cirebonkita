import React from 'react';

interface CirebonLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const CirebonLogo: React.FC<CirebonLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isLight = variant === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#014B35]';
  const taglineColor = isLight ? 'text-emerald-200/90' : 'text-slate-600';
  const emblemSrc = isLight
    ? '/assets/cirebon-emblem-white.png'
    : '/assets/cirebon-emblem.png';

  const emblemSizes = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-14 w-auto',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
  };

  const tagSizes = {
    sm: 'text-[9px] tracking-normal',
    md: 'text-[11px] font-medium tracking-normal',
    lg: 'text-xs font-medium tracking-normal',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Authentic Keraton Cirebon Bentar/Paduraksa Gate Emblem */}
      <img
        src={emblemSrc}
        alt="Logo Keraton Cirebon"
        className={`${emblemSizes[size]} object-contain shrink-0 transition-transform duration-200 hover:scale-105 drop-shadow-xs`}
        loading="eager"
      />

      <div className="flex flex-col justify-center leading-tight">
        <span className={`font-heading ${titleSizes[size]} ${textColor}`}>
          CirebonKita
        </span>
        {showTagline && (
          <span className={`${tagSizes[size]} ${taglineColor} -mt-0.5`}>
            Jelajah Budaya, Cirebon Kita
          </span>
        )}
      </div>
    </div>
  );
};
