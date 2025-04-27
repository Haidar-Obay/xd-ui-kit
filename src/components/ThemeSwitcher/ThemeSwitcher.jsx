import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * ThemeSwitcher Component
 * A flexible theme toggle component with customizable icons, colors, and styles
 */
export const ThemeSwitcher = ({
  theme = 'light',
  onToggle,
  lightColors = {
    background: '#ffffff',
    text: '#1a1a1a',
    inputBackground: '#f1f5f9'
  },
  darkColors = {
    background: '#1a1a1a',
    text: '#ffffff',
    inputBackground: '#374151'
  },
  iconLight,
  iconDark,
  switcherStyle = {},
  className = '',
  transitionDuration = 300,
  size = 'md',
  variant = 'default',
  label,
  showLabel = false
}) => {
  // Apply color scheme to document root
  useEffect(() => {
    const colors = theme === 'light' ? lightColors : darkColors;
    document.documentElement.style.setProperty('--bg-color', colors.background);
    document.documentElement.style.setProperty('--text-color', colors.text);
    document.documentElement.style.setProperty('--input-bg', colors.inputBackground || colors.background);
    document.documentElement.style.setProperty('--transition-duration', `${transitionDuration}ms`);
    
    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme, lightColors, darkColors, transitionDuration]);

  // Size variants
  const sizeClasses = {
    sm: 'h-8 w-14',
    md: 'h-10 w-16',
    lg: 'h-12 w-20'
  };
  
  // Variant styles
  const variantClasses = {
    default: 'bg-gray-200 dark:bg-gray-700',
    pill: 'rounded-full',
    square: 'rounded-md',
    minimal: 'bg-transparent border border-gray-300 dark:border-gray-600'
  };
  
  // Default and custom icons with proper sizing
  const renderIcon = () => {
    if (theme === 'light') {
      return iconLight || <Sun className="w-5 h-5 text-yellow-500" />;
    } else {
      return iconDark || <Moon className="w-5 h-5 text-blue-400" />;
    }
  };

  // Combined class names for the switcher
  const switcherClasses = `
    relative flex items-center justify-center
    transition-all duration-300 ease-in-out
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.default}
    ${variant === 'pill' ? 'rounded-full' : 'rounded-lg'}
    ${className}
  `;

  // Handle toggle with animation
  const handleToggle = () => {
    onToggle();
  };
  
  // The actual button label
  const buttonLabel = label || (theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');

  return (
    <div className="inline-flex items-center gap-3">
      {showLabel && (
        <span 
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: theme === 'light' ? lightColors.text : darkColors.text }}
        >
          {buttonLabel}
        </span>
      )}
      
      <button
        aria-label={buttonLabel}
        className={switcherClasses}
        onClick={handleToggle}
        style={{
          backgroundColor: theme === 'light' 
            ? (lightColors.inputBackground || '#f1f5f9') 
            : (darkColors.inputBackground || '#374151'),
          ...switcherStyle
        }}
      >
        <div 
          className={`
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            ${variant === 'pill' ? 'rounded-full' : 'rounded-md'}
            p-1
          `}
          style={{
            transform: theme === 'light' ? 'translateX(0)' : 'translateX(0)',
            opacity: 1
          }}
        >
          {renderIcon()}
        </div>
        
        <span className="sr-only">{buttonLabel}</span>
      </button>
    </div>
  );
};
