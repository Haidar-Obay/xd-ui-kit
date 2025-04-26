import React, { useState, useEffect, useRef } from 'react';

export const Tabs = ({
  tabs = [],
  defaultActiveTab = 0,
  onChange,
  variant = 'default',
  className = '',
  tabClassName = '',
  activeTabClassName = '',
  contentClassName = '',
  alignment = 'start',
  fullWidth = false,
  animated = true,
  renderOnlyActive = false,
  isDisabled = false,
  persist = false,
  persistKey = 'app-active-tab',
  orientation = 'horizontal',
  responsive = true,
  tabsGap = 0
})=>{
  // Get persisted tab index if enabled
  const getInitialTabIndex = () => {
    if (persist && typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem(persistKey);
      return savedIndex !== null ? parseInt(savedIndex, 10) : defaultActiveTab;
    }
    return defaultActiveTab;
  };

  const [activeTabIndex, setActiveTabIndex] = useState(getInitialTabIndex);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);
  const containerRef = useRef(null);

  // Persists active tab to localStorage if enabled
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem(persistKey, activeTabIndex.toString());
    }
  }, [activeTabIndex, persist, persistKey]);

  // Update the indicator position when active tab changes or on resize
  useEffect(() => {
    const updateIndicator = () => {
      if (tabsRef.current[activeTabIndex] && variant === 'default') {
        const tab = tabsRef.current[activeTabIndex];
        if (orientation === 'horizontal') {
          setIndicatorStyle({
            left: tab.offsetLeft + 'px',
            width: tab.offsetWidth + 'px',
            height: '2px',
            bottom: '0px'
          });
        } else {
          setIndicatorStyle({
            top: tab.offsetTop + 'px',
            height: tab.offsetHeight + 'px',
            width: '2px',
            left: '0px'
          });
        }
      }
    };
    
    updateIndicator();
    
    // Add resize listener
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTabIndex, variant, orientation]);

  // Handle tab change
  const handleTabClick = (index) => {
    if (isDisabled) return;
    setActiveTabIndex(index);
    if (onChange) onChange(index);
  };

  // Create alignment class based on prop
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
      case 'around': return 'justify-around';
      case 'between': return 'justify-between';
      case 'evenly': return 'justify-evenly';
      case 'start':
      default: return 'justify-start';
    }
  };

  // Get variant-specific tab classes
  const getVariantTabClasses = (isActive) => {
    switch (variant) {
      case 'pills':
        return isActive 
          ? 'bg-blue-500 text-white rounded-md shadow-sm' 
          : 'text-gray-700 hover:bg-gray-100 rounded-md';
      case 'underlined':
        return isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-700 hover:text-gray-900 border-b-2 border-transparent';
      case 'boxed':
        return isActive 
          ? 'bg-white border-t border-l border-r rounded-t-md -mb-px' 
          : 'bg-gray-50 border border-transparent hover:bg-gray-100 rounded-t-md';
      case 'default':
      default:
        return isActive 
          ? 'text-blue-600 font-medium' 
          : 'text-gray-600 hover:text-gray-900';
    }
  };

  // Generate classes for each tab
  const getTabClasses = (isActive) => {
    const baseClasses = 'px-4 py-2 focus:outline-none transition-all duration-200 ease-in-out';
    const activeClasses = isActive ? activeTabClassName : '';
    const variantClasses = getVariantTabClasses(isActive);
    const widthClass = fullWidth ? 'flex-1 text-center' : '';
    const disabledClass = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    return `${baseClasses} ${variantClasses} ${activeClasses} ${widthClass} ${disabledClass} ${tabClassName}`;
  };

  // Generate container classes based on orientation
  const containerClasses = orientation === 'horizontal'
    ? `flex ${getAlignmentClass()} ${responsive ? 'overflow-x-auto' : ''} relative`
    : `flex flex-col ${responsive ? 'overflow-y-auto' : ''} relative`;

  return (
    <div className={`tabs-component ${className}`}>
      {/* Tabs Navigation */}
      <div 
        ref={containerRef}
        className={containerClasses}
        style={{ gap: tabsGap + 'px' }}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabsRef.current[index] = el)}
            role="tab"
            aria-selected={activeTabIndex === index}
            aria-controls={`tabpanel-${index}`}
            id={`tab-${index}`}
            className={getTabClasses(activeTabIndex === index)}
            onClick={() => handleTabClick(index)}
            disabled={tab.disabled || isDisabled}
            tabIndex={activeTabIndex === index ? 0 : -1}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span className="px-2 py-1 ml-2 text-xs text-gray-800 bg-gray-100 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
        
        {/* Animated indicator for default variant */}
        {variant === 'default' && (
          <span 
            className={`absolute bg-blue-600 transition-all duration-300 ease-in-out ${animated ? '' : 'hidden'}`}
            style={indicatorStyle}
          />
        )}
      </div>
      
      {/* Tab Content */}
      <div className={`tab-content mt-4 ${contentClassName}`}>
        {tabs.map((tab, index) => (
          (renderOnlyActive && activeTabIndex !== index) ? null : (
            <div
              key={index}
              role="tabpanel"
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
              className={`${activeTabIndex === index ? 'block' : 'hidden'} ${animated ? 'transition-opacity duration-300' : ''}`}
              style={animated ? { opacity: activeTabIndex === index ? 1 : 0 } : {}}
            >
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
}