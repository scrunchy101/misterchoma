
import React from 'react';
import { Store } from 'lucide-react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <Store size={size} className={`text-primary ${className}`} />
  );
};

export default Logo;
