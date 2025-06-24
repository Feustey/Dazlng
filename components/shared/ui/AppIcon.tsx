import React from 'react';
import Image from 'next/image';

export type IconName = 'file' | 'shield' | 'alert' | 'check' | 'x';

const iconMap: Record<IconName, string> = {
  file: '/assets/images/icon-file.svg',
  shield: '/assets/images/icon-shield.svg',
  alert: '/assets/images/icon-alert.svg',
  check: '/assets/images/icon-check.svg',
  x: '/assets/images/icon-x.svg',
};

interface AppIconProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ name, size = 24, className = '', alt = '' }) => (
  <Image
    src={iconMap[name]}
    width={Number(size)}
    height={Number(size)}
    className={className}
    alt={alt || name}
  />
};
export default AppIcon; 