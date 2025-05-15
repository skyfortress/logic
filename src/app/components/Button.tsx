import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isActive?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  isActive = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-medium transition-all duration-200 rounded-md flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shadow-sm hover:shadow',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    outline: 'bg-transparent border border-emerald-600 text-emerald-700 hover:bg-emerald-50',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3',
  };

  const activeClasses = isActive 
    ? variant === 'secondary' ? 'bg-slate-700 text-white border-slate-700' : 'ring-2 ring-offset-2 ring-emerald-500' 
    : '';
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    widthClasses,
    activeClasses,
    className,
  ].join(' ');

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;