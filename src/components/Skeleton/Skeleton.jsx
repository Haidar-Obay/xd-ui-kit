import { useState, useEffect } from 'react';

/**
 * Skeleton - A customizable loading placeholder component
 * 
 * @param {Object} props
 * @param {string} props.variant - The type of skeleton ('text', 'circular', 'rectangular', 'card', 'list', 'avatar', 'image')
 * @param {number} props.width - Width of the skeleton
 * @param {number|string} props.height - Height of the skeleton
 * @param {boolean} props.animated - Whether to show animation
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.count - Number of skeleton items to show
 * @param {boolean} props.active - Whether the skeleton is visible (useful for conditional rendering)
 * @param {number} props.borderRadius - Border radius for the skeleton
 * @param {boolean} props.inline - Whether to display as inline element
 * @param {string} props.animationType - Animation type ('pulse', 'wave', 'shimmer')
 * @param {string} props.baseColor - Base color of the skeleton
 * @param {string} props.highlightColor - Highlight color for animations
 * @param {string} props.direction - Direction for lists ('row', 'column')
 * @param {Object} props.spacing - Spacing between multiple items
 */
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  animated = true,
  className = '',
  count = 1,
  active = true,
  borderRadius,
  inline = false,
  animationType = 'pulse',
  baseColor = '#E2E8F0', // Tailwind gray-200
  highlightColor = '#EDF2F7', // Tailwind gray-100
  direction = 'column',
  spacing = 2,
  ...rest
}) => {
  const [items, setItems] = useState([]);
  
  // Create array of items based on count
  useEffect(() => {
    setItems(Array(count).fill(null).map((_, i) => i));
  }, [count]);

  // Generate animation class based on type
  const getAnimationClass = () => {
    if (!animated) return '';
    
    switch(animationType) {
      case 'wave':
        return 'animate-skeleton-wave';
      case 'shimmer':
        return 'animate-skeleton-shimmer';
      case 'pulse':
      default:
        return 'animate-pulse';
    }
  };

  // Get dimensions and styles based on variant
  const getVariantStyles = () => {
    let styles = {
      backgroundColor: baseColor,
      borderRadius: borderRadius || undefined,
      width: width || undefined,
      height: height || undefined,
      display: inline ? 'inline-block' : 'block'
    };

    switch(variant) {
      case 'circular':
        styles = {
          ...styles,
          borderRadius: '50%',
          width: width || '40px',
          height: height || '40px'
        };
        break;
      case 'rectangular':
        styles = {
          ...styles,
          borderRadius: borderRadius || '4px',
          width: width || '100%',
          height: height || '20px'
        };
        break;
      case 'avatar':
        styles = {
          ...styles,
          borderRadius: '50%',
          width: width || '40px',
          height: height || '40px'
        };
        break;
      case 'card':
        styles = {
          ...styles,
          borderRadius: borderRadius || '8px',
          width: width || '100%',
          height: height || '200px'
        };
        break;
      case 'image':
        styles = {
          ...styles,
          borderRadius: borderRadius || '4px',
          width: width || '100%',
          height: height || '200px'
        };
        break;
      case 'list-item':
        // List item styling will be handled in the render method
        styles = {
          ...styles,
          width: width || '100%',
        };
        break;
      case 'text':
      default:
        styles = {
          ...styles,
          borderRadius: borderRadius || '4px',
          width: width || '100%',
          height: height || '16px'
        };
    }

    return styles;
  };

  // Render list item skeleton 
  const renderListItem = (key) => {
    return (
      <div key={key} className="flex items-center mb-4">
        <div
          style={{
            backgroundColor: baseColor,
            borderRadius: '50%',
            width: '40px',
            height: '40px'
          }}
          className="flex-shrink-0"
        ></div>
        <div className="flex-grow ml-3">
          <div
            style={{
              backgroundColor: baseColor,
              borderRadius: '4px',
              height: '12px',
              width: '80%',
              marginBottom: '8px'
            }}
          ></div>
          <div
            style={{
              backgroundColor: baseColor,
              borderRadius: '4px',
              height: '12px',
              width: '60%'
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Don't render anything if not active
  if (!active) return null;

  // Add animation keyframes for custom animations
  const customAnimationStyles = animated && animationType !== 'pulse' ? (
    <style jsx>{`
      @keyframes skeleton-wave {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
        100% {
          opacity: 1;
        }
      }
      
      @keyframes skeleton-shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }
      
      .animate-skeleton-wave {
        animation: skeleton-wave 1.5s ease-in-out 0.5s infinite;
      }
      
      .animate-skeleton-shimmer {
        background: linear-gradient(to right, ${baseColor} 8%, ${highlightColor} 18%, ${baseColor} 33%);
        background-size: 800px 100%;
        animation: skeleton-shimmer 1.5s linear infinite;
      }
    `}</style>
  ) : null;

  // Render skeleton items
  return (
    <>
      {customAnimationStyles}
      <div 
        className={`skeleton-container ${getAnimationClass()} ${className}`}
        style={{ 
          display: 'flex', 
          flexDirection: direction,
          gap: `${spacing * 0.25}rem`
        }}
        {...rest}
      >
        {items.map((i) => (
          variant === 'list-item' ? 
            renderListItem(`skeleton-${i}`) : 
            <div 
              key={`skeleton-${i}`}
              className="skeleton-item"
              style={getVariantStyles()}
            />
        ))}
      </div>
    </>
  );
};

// Preset compositions for common use cases
Skeleton.Text = (props) => <Skeleton variant="text" {...props} />;
Skeleton.Circle = (props) => <Skeleton variant="circular" {...props} />;
Skeleton.Rectangle = (props) => <Skeleton variant="rectangular" {...props} />;
Skeleton.Avatar = (props) => <Skeleton variant="avatar" {...props} />;
Skeleton.Image = (props) => <Skeleton variant="image" {...props} />;
Skeleton.Card = (props) => <Skeleton variant="card" {...props} />;

// Composition for a paragraph
Skeleton.Paragraph = ({ lines = 3, lastLineWidth = 70, ...props }) => {
  return (
    <div className="skeleton-paragraph">
      {Array(lines - 1).fill(null).map((_, i) => (
        <Skeleton 
          key={`paragraph-line-${i}`}
          variant="text"
          className="mb-2"
          {...props}
        />
      ))}
      <Skeleton 
        variant="text"
        width={`${lastLineWidth}%`}
        {...props}
      />
    </div>
  );
};

// Profile card composition
Skeleton.Profile = (props) => {
  return (
    <div className="flex flex-col p-4 border rounded-lg">
      <div className="flex items-center mb-4">
        <Skeleton variant="avatar" width={60} height={60} />
        <div className="ml-3">
          <Skeleton variant="text" width={120} className="mb-2" />
          <Skeleton variant="text" width={90} height={12} />
        </div>
      </div>
      <Skeleton.Paragraph lines={2} />
    </div>
  );
};

// Table skeleton
Skeleton.Table = ({ rows = 5, columns = 4, ...props }) => {
  return (
    <div className="w-full">
      <div className="flex pb-2 mb-4 border-b">
        {Array(columns).fill(null).map((_, i) => (
          <div key={`header-${i}`} className="flex-1 px-2">
            <Skeleton variant="text" height={20} />
          </div>
        ))}
      </div>
      
      {Array(rows).fill(null).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex py-2 border-b">
          {Array(columns).fill(null).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 px-2">
              <Skeleton variant="text" height={16} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// List skeleton
Skeleton.List = ({ items = 3, ...props }) => (
  <Skeleton variant="list-item" count={items} {...props} />
);

