import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "font-bold rounded-full transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-purple hover:bg-indigo-600 text-white focus:ring-indigo-300",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 focus:ring-gray-200",
    danger: "bg-brand-red hover:bg-red-600 text-white focus:ring-red-300",
    success: "bg-brand-green hover:bg-teal-600 text-white focus:ring-teal-300"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </div>
    </button>
  );
};