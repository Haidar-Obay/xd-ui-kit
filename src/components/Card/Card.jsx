import React from 'react';
import { ChevronRight, ExternalLink, Bookmark, Clock, Heart, Share2 } from 'lucide-react';

export const Card = ({
  // Content props
  title,
  subtitle,
  description,
  image,
  footer,
  children,
  
  // Style and layout props
  variant = 'default', // default, horizontal, compact, feature, pricing, profile, interactive
  elevation = 'md', // none, sm, md, lg, xl
  radius = 'md', // none, sm, md, lg, xl, full
  width = 'auto',
  height = 'auto',
  padding = 'md', // none, sm, md, lg, xl
  align = 'left', // left, center, right
  
  // Action props
  onClick,
  href,
  target,
  
  // Interactive props
  hoverable = false,
  selected = false,
  disabled = false,
  loading = false,
  
  // Feature props
  icon,
  badge,
  tags = [],
  actions = [],
  accentColor,
  
  // Component classes
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  imageClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  descriptionClassName = '',
  
  // Additional options
  aspectRatio = null, // For the image: '1:1', '16:9', '4:3', etc.
  imagePosition = 'top', // top, left, right, bottom, background
  imageFit = 'cover', // cover, contain
  divider = false, // Show dividers between card sections
  cardRef = null
}) => {
  // Helper function to get elevation class
  const getElevationClass = () => {
    switch(elevation) {
      case 'none': return '';
      case 'sm': return 'shadow-sm';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      case 'md':
      default: return 'shadow';
    }
  };
  
  // Helper function to get radius class
  const getRadiusClass = () => {
    switch(radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'lg': return 'rounded-lg';
      case 'xl': return 'rounded-xl';
      case 'full': return 'rounded-full';
      case 'md':
      default: return 'rounded-md';
    }
  };
  
  // Helper function to get padding class
  const getPaddingClass = () => {
    switch(padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-2';
      case 'lg': return 'p-6';
      case 'xl': return 'p-8';
      case 'md':
      default: return 'p-4';
    }
  };
  
  // Helper function to get aspect ratio class
  const getAspectRatioClass = () => {
    if (!aspectRatio) return '';
    
    switch(aspectRatio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '3:2': return 'aspect-[3/2]';
      case '2:3': return 'aspect-[2/3]';
      default: return aspectRatio.includes(':') ? `aspect-[${aspectRatio.replace(':', '/')}]` : '';
    }
  };
  
  // Helper function to get alignment class
  const getAlignClass = () => {
    switch(align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'left':
      default: return 'text-left';
    }
  };
  
  // Determine the wrapper element and its props
  const WrapperElement = href ? 'a' : onClick ? 'button' : 'div';
  const wrapperProps = {
    className: `
      ${getRadiusClass()} 
      ${getElevationClass()} 
      ${getPaddingClass()} 
      ${getAlignClass()} 
      bg-white 
      overflow-hidden 
      ${hoverable ? 'transition-all duration-300 hover:shadow-lg' : ''}
      ${selected ? 'ring-2 ring-blue-500' : ''}
      ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
      ${onClick || href ? 'cursor-pointer' : ''}
      ${imagePosition === 'background' ? 'relative' : ''}
      ${className}
    `,
    style: {
      width,
      height,
      borderLeft: accentColor ? `4px solid ${accentColor}` : undefined
    },
    ...(href ? { href, target } : {}),
    ...(onClick && !disabled ? { onClick } : {}),
    ...(cardRef ? { ref: cardRef } : {})
  };
  
  // Helper to render the image based on position
  const renderImage = () => {
    if (!image) return null;
    
    const imageComponent = (
      <div 
        className={`
          overflow-hidden
          ${getAspectRatioClass()}
          ${imagePosition === 'background' ? 'absolute inset-0 z-0' : ''}
          ${imageClassName}
        `}
      >
        {typeof image === 'string' ? (
          <img 
            src={image} 
            alt={title || "Card image"} 
            className={`w-full h-full object-${imageFit}`}
          />
        ) : (
          image
        )}
        {imagePosition === 'background' && (
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent"></div>
        )}
      </div>
    );
    
    return imageComponent;
  };
  
  // Helper to render the card header
  const renderHeader = () => {
    if (!title && !subtitle && !badge) return null;
    
    return (
      <div className={`${divider ? 'border-b pb-3 mb-3' : ''} ${headerClassName}`}>
        <div className="flex items-start justify-between">
          <div>
            {title && (
              <h3 className={`font-bold text-gray-900 ${titleClassName}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <div className={`text-sm text-gray-600 mt-1 ${subtitleClassName}`}>
                {subtitle}
              </div>
            )}
          </div>
          {badge && (
            <div className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded">
              {badge}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Helper to render the card content
  const renderContent = () => {
    return (
      <div className={`${bodyClassName} ${imagePosition === 'background' ? 'relative z-20' : ''}`}>
        {icon && (
          <div className="mb-4">
            {typeof icon === 'string' ? (
              <img src={icon} alt="icon" className="w-10 h-10" />
            ) : (
              React.cloneElement(icon, { 
                size: 24,
                className: `${icon.props.className || ''} ${accentColor ? `text-[${accentColor}]` : 'text-blue-600'}`
              })
            )}
          </div>
        )}
        
        {renderHeader()}
        
        {description && (
          <p className={`text-gray-600 ${divider && title ? 'mt-3' : ''} ${descriptionClassName}`}>
            {description}
          </p>
        )}
        
        {children}
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span key={index} className="inline-block px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Helper to render the card footer
  const renderFooter = () => {
    if (!footer && actions.length === 0) return null;
    
    return (
      <div className={`${divider ? 'border-t pt-3 mt-3' : ''} ${footerClassName}`}>
        {footer ? (
          footer
        ) : actions.length > 0 ? (
          <div className="flex items-center justify-end space-x-2">
            {actions.map((action, index) => (
              <button 
                key={index}
                onClick={action.onClick}
                className={`
                  px-3 py-1 text-sm rounded
                  ${action.primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };
  
  // Loading state UI
  if (loading) {
    return (
      <div {...wrapperProps}>
        <div className="animate-pulse">
          {image && (
            <div className={`bg-gray-300 ${getAspectRatioClass() || 'h-40'}`}></div>
          )}
          <div className="p-4">
            <div className="w-3/4 h-4 mb-4 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-3 mb-2 bg-gray-300 rounded"></div>
            <div className="w-5/6 h-3 mb-2 bg-gray-300 rounded"></div>
            <div className="w-4/6 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render different card variants
  const renderCardContent = () => {
    switch (variant) {
      case 'horizontal':
        return (
          <div className="flex flex-col md:flex-row">
            {(imagePosition === 'left' || !imagePosition) && image && (
              <div className="flex-shrink-0 md:w-1/3">
                {renderImage()}
              </div>
            )}
            <div className={`${image ? 'md:w-2/3' : 'w-full'} ${getPaddingClass()}`}>
              {renderContent()}
              {renderFooter()}
            </div>
            {imagePosition === 'right' && image && (
              <div className="flex-shrink-0 md:w-1/3">
                {renderImage()}
              </div>
            )}
          </div>
        );
        
      case 'compact':
        return (
          <>
            <div className="flex items-center space-x-3">
              {image && (
                <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-full">
                  {typeof image === 'string' ? (
                    <img src={image} alt={title || "Avatar"} className="object-cover w-full h-full" />
                  ) : (
                    image
                  )}
                </div>
              )}
              <div>
                {title && <div className="font-medium text-gray-900">{title}</div>}
                {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
              </div>
              {actions.length > 0 && (
                <div className="ml-auto">
                  <button className="text-gray-400 hover:text-gray-600">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
            {description && (
              <div className="mt-2 text-sm text-gray-600">{description}</div>
            )}
          </>
        );
        
      case 'feature':
        return (
          <>
            {image && imagePosition !== 'background' && renderImage()}
            <div className={`${imagePosition === 'background' ? 'text-white' : ''}`}>
              {icon && (
                <div 
                  className={`
                    inline-flex items-center justify-center p-2 rounded-md mb-4
                    ${accentColor ? `bg-${accentColor}-100 text-${accentColor}-600` : 'bg-blue-100 text-blue-600'}
                  `}
                >
                  {typeof icon === 'string' ? (
                    <img src={icon} alt="icon" className="w-6 h-6" />
                  ) : (
                    icon
                  )}
                </div>
              )}
              {renderHeader()}
              {description && (
                <p className={`${imagePosition === 'background' ? 'text-white/90' : 'text-gray-600'} ${descriptionClassName}`}>
                  {description}
                </p>
              )}
              {children}
              {renderFooter()}
            </div>
          </>
        );
        
      case 'pricing':
        return (
          <>
            {badge && (
              <div className="px-2 py-1 mb-4 -mx-4 -mt-4 text-xs text-center text-white bg-blue-500 rounded-t-md">
                {badge}
              </div>
            )}
            <div className="mb-4 text-center">
              {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
              {description && (
                <div className="mt-4">
                  <span className="text-4xl font-bold">{description}</span>
                  <span className="ml-1 text-gray-600">/mo</span>
                </div>
              )}
            </div>
            {children}
            {renderFooter()}
          </>
        );
        
      case 'profile':
        return (
          <>
            <div className="text-center">
              {image && (
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                  {typeof image === 'string' ? (
                    <img src={image} alt={title || "Profile"} className="object-cover w-full h-full" />
                  ) : (
                    image
                  )}
                </div>
              )}
              {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
              {description && (
                <p className="mt-2 text-gray-600">{description}</p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <span key={index} className="inline-block px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {children}
            {renderFooter()}
          </>
        );
        
      case 'interactive':
        return (
          <>
            {image && imagePosition !== 'background' && renderImage()}
            <div className="relative">
              {renderContent()}
              <div className="absolute bottom-0 right-0">
                <div className="flex items-center space-x-2">
                  {actions.map((action, index) => (
                    <button 
                      key={index}
                      onClick={e => {
                        e.stopPropagation();
                        action.onClick && action.onClick(e);
                      }}
                      className="flex items-center justify-center w-8 h-8 transition-colors rounded-full hover:bg-gray-100"
                    >
                      {action.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {footer && renderFooter()}
          </>
        );
        
      case 'default':
      default:
        return (
          <>
            {image && imagePosition === 'top' && renderImage()}
            {renderContent()}
            {renderFooter()}
          </>
        );
    }
  };
  
  return (
    <WrapperElement {...wrapperProps}>
      {imagePosition === 'background' && renderImage()}
      {renderCardContent()}
    </WrapperElement>
  );
};

// Pre-configured card variants
Card.Article = (props) => (
  <Card
    variant="default"
    imagePosition="top"
    aspectRatio="16:9"
    divider={true}
    elevation="sm"
    hoverable={true}
    {...props}
  />
);

Card.Feature = (props) => (
  <Card
    variant="feature"
    elevation="md"
    align="center"
    {...props}
  />
);

Card.Profile = (props) => (
  <Card
    variant="profile"
    elevation="sm"
    align="center"
    padding="lg"
    {...props}
  />
);

Card.Pricing = (props) => (
  <Card
    variant="pricing"
    elevation="md"
    align="center"
    hoverable={true}
    {...props}
  />
);

Card.Interactive = (props) => {
  const defaultActions = [
    { icon: <Heart size={18} className="text-gray-500" />, onClick: () => {} },
    { icon: <Bookmark size={18} className="text-gray-500" />, onClick: () => {} },
    { icon: <Share2 size={18} className="text-gray-500" />, onClick: () => {} }
  ];
  
  return (
    <Card
      variant="interactive"
      elevation="sm"
      hoverable={true}
      actions={props.actions || defaultActions}
      {...props}
    />
  );
};

Card.Compact = (props) => (
  <Card
    variant="compact"
    elevation="sm"
    padding="sm"
    radius="sm"
    {...props}
  />
);

Card.Horizontal = (props) => (
  <Card
    variant="horizontal"
    padding="none"
    imagePosition="left"
    {...props}
  />
);

