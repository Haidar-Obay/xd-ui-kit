import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  footer = null,
  closeOnEsc = true,
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  initialFocus = null,
  position = 'center', // 'center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  animation = 'fade', // 'fade', 'zoom', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'rotate', 'flip', 'bounce', 'swing'
  duration = 300, // animation duration in ms
  backdropFilter = 'none', // 'none', 'blur', 'grayscale', 'invert', 'sepia'
  backdropColor = 'dark', // 'dark', 'light', 'transparent'
  draggable = false,
  resizable = false,
  fullScreenButton = false,
  zIndex = 50,
  width = null, // custom width (overrides size)
  height = null, // custom height
  modalId = null, // for stacked modals
  showScrollbar = true,
  roundedCorners = true,
  showHeader = true,
  showFooter = true,
  contentPadding = true,
  closeButton = {
    position: 'header', // 'header', 'outside', 'none'
    icon: <X size={20} />,
  },
  theme = 'light', // 'light', 'dark', 'system', 'custom'
  themeColors = {
    light: {
      background: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
    dark: {
      background: 'bg-gray-800',
      text: 'text-gray-100',
      border: 'border-gray-700',
    },
    custom: {
      background: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
  },
  onDragStart = () => {},
  onDragEnd = () => {},
  onResize = () => {},
  onFullScreen = () => {},
  onAnimationComplete = () => {},
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [prevSize, setPrevSize] = useState(null);
  const [customTransform, setCustomTransform] = useState('');
  const [systemTheme, setSystemTheme] = useState('light');
  
  const modalRef = useRef(null);
  const dragHandleRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Generate a unique ID for the modal if one isn't provided
  const uniqueId = useRef(`modal-${Math.random().toString(36).substr(2, 9)}`);
  const actualModalId = modalId || uniqueId.current;

  // Define size classes
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  // Define position classes
  const positionClasses = {
    'center': 'items-center justify-center',
    'top': 'items-start justify-center pt-16',
    'bottom': 'items-end justify-center pb-16',
    'left': 'items-center justify-start pl-16',
    'right': 'items-center justify-end pr-16',
    'top-left': 'items-start justify-start pt-16 pl-16',
    'top-right': 'items-start justify-end pt-16 pr-16',
    'bottom-left': 'items-end justify-start pb-16 pl-16',
    'bottom-right': 'items-end justify-end pb-16 pr-16',
  };

  // Define backdrop filter classes
  const backdropFilterClasses = {
    'none': '',
    'blur': 'backdrop-blur-md',
    'grayscale': 'backdrop-grayscale',
    'invert': 'backdrop-invert',
    'sepia': 'backdrop-sepia',
  };

  // Define backdrop color classes
  const backdropColorClasses = {
    'dark': 'bg-black bg-opacity-50',
    'light': 'bg-white bg-opacity-50',
    'transparent': 'bg-transparent',
  };

  // Define animation classes
  const getAnimationClasses = () => {
    // Initial state classes (not animated yet)
    const initial = {
      'fade': 'opacity-0',
      'zoom': 'opacity-0 scale-95',
      'slide-up': 'opacity-0 translate-y-8',
      'slide-down': 'opacity-0 -translate-y-8',
      'slide-left': 'opacity-0 translate-x-8',
      'slide-right': 'opacity-0 -translate-x-8',
      'rotate': 'opacity-0 rotate-12',
      'flip': 'opacity-0 rotateX-90',
      'bounce': 'opacity-0 scale-95',
      'swing': 'opacity-0 rotate-3',
    };
    
    // Animated state classes
    const animated = {
      'fade': 'opacity-100',
      'zoom': 'opacity-100 scale-100',
      'slide-up': 'opacity-100 translate-y-0',
      'slide-down': 'opacity-100 translate-y-0',
      'slide-left': 'opacity-100 translate-x-0',
      'slide-right': 'opacity-100 translate-x-0',
      'rotate': 'opacity-100 rotate-0',
      'flip': 'opacity-100 rotateX-0',
      'bounce': 'opacity-100 scale-100',
      'swing': 'opacity-100 rotate-0',
    };

    return {
      initial: initial[animation] || initial.fade,
      animated: animated[animation] || animated.fade
    };
  };

  const animationClasses = getAnimationClasses();

  // Detect system theme for 'system' theme option
  useEffect(() => {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDarkMode ? 'dark' : 'light');
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Determine current theme based on theme prop
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const themeColorClasses = themeColors[currentTheme] || themeColors.light;
  
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      setIsAnimating(true);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Animation timing
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
        // Call the animation complete callback after animation completes
        transitionTimeoutRef.current = setTimeout(() => {
          onAnimationComplete();
        }, duration);
      }, 10);
      return () => {
        clearTimeout(timer);
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
      };
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, duration, onAnimationComplete]);

  // Handle focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        } else if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleTabKey);
    
    // Focus handling
    if (initialFocus && initialFocus.current) {
      initialFocus.current.focus();
    } else {
      const focusableElement = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElement) {
        focusableElement.focus();
      }
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener('keydown', handleTabKey);
      }
    };
  }, [isOpen, initialFocus]);

  // Handle dragging
  const handleMouseDown = useCallback((e) => {
    if (!draggable || isFullScreen) return;
    
    // Only allow dragging from the header
    if (e.target.closest('.modal-header')) {
      const rect = modalRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      onDragStart();
    }
  }, [draggable, isFullScreen, onDragStart]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep the modal within the viewport
    const modalWidth = modalRef.current.offsetWidth;
    const modalHeight = modalRef.current.offsetHeight;
    const maxX = window.innerWidth - modalWidth;
    const maxY = window.innerHeight - modalHeight;
    
    const boundedX = Math.max(0, Math.min(x, maxX));
    const boundedY = Math.max(0, Math.min(y, maxY));
    
    setDragPosition({ x: boundedX, y: boundedY });
    setCustomTransform(`translate(${boundedX}px, ${boundedY}px)`);
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(dragPosition);
    }
  }, [isDragging, dragPosition, onDragEnd]);

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (draggable) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggable, handleMouseMove, handleMouseUp]);

  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    if (isFullScreen) {
      setIsFullScreen(false);
      if (prevSize) {
        // Restore previous size
      }
    } else {
      setPrevSize({
        width: modalRef.current.style.width,
        height: modalRef.current.style.height
      });
      setIsFullScreen(true);
      // Reset drag position when going fullscreen
      setDragPosition({ x: 0, y: 0 });
      setCustomTransform('');
    }
    onFullScreen(!isFullScreen);
  };

  if (!isOpen) return null;

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Custom width/height styles
  const dimensionStyles = {};
  if (width) dimensionStyles.width = width;
  if (height) dimensionStyles.height = height;
  if (customTransform) dimensionStyles.transform = customTransform;

  // Fullscreen styles
  const fullScreenStyles = isFullScreen ? {
    width: '100vw',
    height: '100vh',
    maxWidth: '100vw',
    maxHeight: '100vh',
    borderRadius: '0',
    transform: 'none',
    margin: '0'
  } : {};

  // Combine styles
  const combinedStyles = {
    ...dimensionStyles,
    ...fullScreenStyles,
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
  };

  // External close button
  const renderExternalCloseButton = () => {
    if (closeButton.position === 'outside') {
      return (
        <button
          onClick={onClose}
          className="absolute z-10 p-2 text-white bg-gray-800 rounded-full -top-3 -right-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close modal"
        >
          {closeButton.icon}
        </button>
      );
    }
    return null;
  };

  return (
    <div 
      className={`fixed inset-0 z-${zIndex} flex ${positionClasses[position] || positionClasses.center} ${backdropFilterClasses[backdropFilter]} ${backdropColorClasses[backdropColor]} transition-opacity ${duration}ms ease-in-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      } ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={`${actualModalId}-title`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      <div
        ref={modalRef}
        className={`${themeColorClasses.background} ${themeColorClasses.text} ${roundedCorners && !isFullScreen ? 'rounded-lg' : ''} shadow-xl transform transition-all ${
          isAnimating ? animationClasses.animated : animationClasses.initial
        } ${!isFullScreen && sizeClasses[size]} ${!isFullScreen ? 'w-full m-4' : ''} ${className} ${isDragging ? 'cursor-grabbing' : ''}`}
        style={combinedStyles}
        onMouseDown={handleMouseDown}
        id={actualModalId}
      >
        {renderExternalCloseButton()}

        {/* Header */}
        {showHeader && (
          <div className={`flex items-center justify-between p-4 ${themeColorClasses.border} border-b modal-header ${draggable && !isFullScreen ? 'cursor-move' : ''}`}>
            <h2 className="text-xl font-semibold" id={`${actualModalId}-title`}>
              {title}
            </h2>
            <div className="flex items-center space-x-2">
              {fullScreenButton && (
                <button
                  onClick={toggleFullScreen}
                  className="p-1 text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={isFullScreen ? "Exit full screen" : "Full screen"}
                >
                  {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              )}
              {draggable && !isFullScreen && (
                <div
                  ref={dragHandleRef}
                  className="p-1 text-gray-400 rounded-md cursor-move hover:text-gray-500"
                  aria-label="Drag modal"
                >
                  <Move size={20} />
                </div>
              )}
              {showCloseButton && closeButton.position === 'header' && (
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
                  ref={firstFocusableRef}
                >
                  {closeButton.icon}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`${contentPadding ? 'p-4' : 'p-0'} ${showScrollbar ? 'overflow-y-auto' : 'overflow-hidden'} ${isFullScreen ? 'flex-grow' : `max-h-[70vh]`}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && showFooter && (
          <div className={`p-4 ${themeColorClasses.border} border-t flex justify-end space-x-2`}>
            {footer}
          </div>
        )}
        
        {/* Hidden button for focus trapping */}
        <button className="sr-only" ref={lastFocusableRef} tabIndex={0}></button>
      </div>
    </div>
  );
};


