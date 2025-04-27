import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Home, Settings, Users, Shield, Menu } from 'lucide-react';

// Default sidebar configuration
const defaultConfig = {
  position: 'left',
  width: 240,
  collapsedWidth: 64,
  isCollapsible: true,
  isFixed: true,
  animation: 'slide',
  behavior: 'docked',
};

export const Sidebar=({
  items = [],
  isOpen = true,
  onToggle,
  activeItem = '',
  onItemClick,
  position = defaultConfig.position,
  width = defaultConfig.width,
  style = {},
  isCollapsible = defaultConfig.isCollapsible,
  isFixed = defaultConfig.isFixed,
  search = false,
  subMenuItems = {},
  header = null,
  footer = null,
  customIcons = {},
  authRequired = false,
  animation = defaultConfig.animation,
  behavior = defaultConfig.behavior,
  userRole = 'user', // Default role
}) => {
  const [collapsed, setCollapsed] = useState(!isOpen);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [expandedSubMenus, setExpandedSubMenus] = useState({});
  const sidebarRef = useRef(null);
  const collapsedWidth = defaultConfig.collapsedWidth;

  // Handle sidebar toggle
  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) onToggle(!newState);
  };

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const filtered = items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  // Handle clicks outside to close sidebar in overlay mode on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        behavior === 'overlay' && 
        isOpen && 
        sidebarRef.current && 
        !sidebarRef.current.contains(e.target) && 
        window.innerWidth < 768
      ) {
        if (onToggle) onToggle(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, behavior, onToggle]);

  // Toggle submenu expansion
  const toggleSubMenu = (itemId) => {
    setExpandedSubMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Check if user has permission to see this item
  const hasPermission = (itemPermission) => {
    if (!itemPermission) return true;
    
    const permissions = {
      user: ['user'],
      admin: ['user', 'admin'],
      superadmin: ['user', 'admin', 'superadmin']
    };
    
    return permissions[userRole]?.includes(itemPermission) || false;
  };

  // Get icon component
  const getIcon = (icon) => {
    if (!icon) return null;
    
    const iconMap = {
      home: Home,
      settings: Settings,
      users: Users,
      shield: Shield,
      menu: Menu,
      ...customIcons
    };
    
    const IconComponent = iconMap[icon] || null;
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  // Handle item click with permission check
  const handleItemClick = (item) => {
    if (item.authRequired && !authRequired) return;
    if (item.permission && !hasPermission(item.permission)) return;
    
    if (onItemClick) onItemClick(item);
    
    // If item has subitems, toggle submenu
    if (subMenuItems[item.id] && subMenuItems[item.id].length > 0) {
      toggleSubMenu(item.id);
    }
  };

  // Dynamic styles based on props
  const sidebarStyle = {
    width: collapsed ? collapsedWidth : width,
    position: isFixed ? 'fixed' : 'relative',
    top: isFixed ? 0 : 'auto',
    bottom: isFixed ? 0 : 'auto',
    [position]: 0,
    transition: animation === 'slide' ? 'all 0.3s ease' : 'none',
    zIndex: 50,
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRight: position === 'left' ? '1px solid #e2e8f0' : 'none',
    borderLeft: position === 'right' ? '1px solid #e2e8f0' : 'none',
    height: '100vh',
    ...style,
  };

  // Apply behavior styles
  const contentStyle = {
    marginLeft: behavior === 'pushed' && position === 'left' && !collapsed ? width : 0,
    marginRight: behavior === 'pushed' && position === 'right' && !collapsed ? width : 0,
    transition: 'margin 0.3s ease',
  };

  // Generate classes for animation
  const getAnimationClasses = () => {
    if (animation === 'fade') {
      return collapsed ? 'opacity-0' : 'opacity-100';
    }
    return '';
  };

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`sidebar bg-white shadow-lg ${getAnimationClasses()}`}
        style={sidebarStyle}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b sidebar-header">
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              {header || <h2 className="text-xl font-semibold truncate">Navigation</h2>}
            </div>
          )}
          {isCollapsible && (
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={handleToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {position === 'left' ? 
                (collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />) :
                (collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />)
              }
            </button>
          )}
        </div>

        {/* Search Section */}
        {search && !collapsed && (
          <div className="px-4 py-2 border-b">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-8 pr-4 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 py-2 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {filteredItems.map((item) => {
              // Skip item if user doesn't have permission
              if (item.permission && !hasPermission(item.permission)) return null;
              // Skip item if auth required but user not authenticated
              if (item.authRequired && !authRequired) return null;

              const isActive = activeItem === item.id;
              const hasSubItems = subMenuItems[item.id] && subMenuItems[item.id].length > 0;
              const isExpanded = expandedSubMenus[item.id];

              return (
                <React.Fragment key={item.id}>
                  <li>
                    <button
                      className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-md transition-colors ${
                        isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-center">
                        {getIcon(item.icon) && (
                          <span className={`${!collapsed ? 'mr-3' : ''}`}>
                            {getIcon(item.icon)}
                          </span>
                        )}
                        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                      </div>
                      {!collapsed && hasSubItems && (
                        <ChevronRight 
                          size={16} 
                          className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        />
                      )}
                    </button>
                  </li>

                  {/* Sub-menu items */}
                  {!collapsed && hasSubItems && isExpanded && (
                    <div className="pl-2 mt-1 mb-2 ml-6 border-l-2 border-gray-200">
                      {subMenuItems[item.id].map((subItem) => {
                        // Skip subitem if user doesn't have permission
                        if (subItem.permission && !hasPermission(subItem.permission)) return null;
                        
                        const isSubItemActive = activeItem === subItem.id;
                        
                        return (
                          <button
                            key={subItem.id}
                            className={`w-full flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
                              isSubItemActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => onItemClick && onItemClick(subItem)}
                          >
                            {getIcon(subItem.icon) && (
                              <span className="mr-2">
                                {getIcon(subItem.icon)}
                              </span>
                            )}
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>

        {/* Footer Section */}
        {footer && (
          <div className={`sidebar-footer p-4 border-t ${collapsed ? 'text-center' : ''}`}>
            {footer}
          </div>
        )}
      </div>
      
      {/* Add overlay for overlay behavior on mobile */}
      {isOpen && behavior === 'overlay' && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => onToggle && onToggle(false)}
        />
      )}
      
      {/* Main content area */}
      <div className="content-area" style={contentStyle}>
        {/* This is where your main content would go */}
      </div>
    </>
  );
}