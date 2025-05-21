import React from 'react';

export type IconName = 'file' | 'shield' | 'alert' | 'check' | 'x';

const iconMap: Record<IconName, string> = {
  file: '/assets/images/icon-file.svg',
  shield: '/assets/images/icon-shield.svg',
  alert: '/assets/images/icon-alert.svg',
  check: '/assets/images/icon-check.svg',
  x: '/assets/images/icon-x.svg',
};

interface AppIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ name, size = 24, className = '', alt = '', ...props }) => (
  <img
    src={iconMap[name]}
    width={size}
    height={size}
    className={className}
    alt={alt || name}
    {...props}
  />
);

export default AppIcon; 