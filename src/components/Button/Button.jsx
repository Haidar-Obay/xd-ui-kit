import React from 'react';
import { Loader2, ExternalLink, ChevronRight } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  rounded = false,
  elevated = false,
  iconOnly = false,
  active = false,
  asChild = false,
  href,
  target,
  className = '',
  loadingText,
  ariaLabel,
  customColors = {},  // New prop for custom colors
  ...props
}) => {
  // Default variant styles
  const defaultVariantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 active:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700 active:bg-black',
    light: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300 active:bg-gray-100',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline p-0 h-auto focus:ring-blue-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500',
  };

  // Merge custom colors with defaults
  const variantStyles = {
    ...defaultVariantStyles,
    ...customColors
  };

  // Size styles
  const sizeStyles = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-xs px-3 py-1.5 rounded',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-lg',
    xl: 'text-lg px-8 py-4 rounded-lg',
  };

  // Icon only size adjustments
  const iconOnlySizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  const baseStyles = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2';
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  const roundedStyles = rounded ? 'rounded-full' : '';
  const elevatedStyles = elevated ? 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5' : '';
  const activeStyles = active ? 'ring-2' : '';
  const iconOnlyStyles = iconOnly ? `${iconOnlySizes[size]} aspect-square` : '';

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${iconOnly ? iconOnlyStyles : sizeStyles[size]} ${widthStyles} ${disabledStyles} ${roundedStyles} ${elevatedStyles} ${activeStyles} ${className}`;

  const getButtonContent = () => (
    <>
      {loading && (
        <>
          <Loader2 className="animate-spin" size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 20 : size === 'xl' ? 24 : 16} />
          {loadingText && <span>{loadingText}</span>}
        </>
      )}
      {!loading && (
        <>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </>
      )}
    </>
  );

  if (href) {
    const isExternal = href.startsWith('http') || target === '_blank';
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        {...props}
      >
        {getButtonContent()}
        {isExternal && !rightIcon && !iconOnly && <ExternalLink className="ml-1" size={size === 'xs' || size === 'sm' ? 12 : 16} />}
      </a>
    );
  }

  const ButtonComponent = asChild ? (props.component || 'div') : 'button';
  return (
    <ButtonComponent
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {getButtonContent()}
    </ButtonComponent>
  );
};

// Demo button with pulse animation
export const PulseButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      className="relative"
    >
      <span className="absolute inset-0 bg-blue-400 rounded-md animate-ping opacity-30"></span>
      {children}
    </Button>
  );
};

// Button with icon animation on hover
export const AnimatedIconButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      rightIcon={<ChevronRight className="transition-transform group-hover:translate-x-1" />}
      className="group"
    >
      {children}
    </Button>
  );
};

// Button Group component for related buttons
export const ButtonGroup = ({ children, vertical = false, className = '', ...props }) => {
  return (
    <div 
      className={`inline-flex ${vertical ? 'flex-col' : 'flex-row'} rounded-md shadow-sm ${className}`}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        // Apply special styling for button group
        let groupPositionClass = '';
        if (vertical) {
          if (index === 0) groupPositionClass = 'rounded-b-none';
          else if (index === React.Children.count(children) - 1) groupPositionClass = 'rounded-t-none border-t-0';
          else groupPositionClass = 'rounded-none border-t-0';
        } else {
          if (index === 0) groupPositionClass = 'rounded-r-none';
          else if (index === React.Children.count(children) - 1) groupPositionClass = 'rounded-l-none border-l-0';
          else groupPositionClass = 'rounded-none border-l-0';
        }
        
        return React.cloneElement(child, {
          className: `${child.props.className || ''} ${groupPositionClass} ${index !== 0 && !vertical ? '-ml-px' : ''} ${index !== 0 && vertical ? '-mt-px' : ''}`
        });
      })}
    </div>
  );
};