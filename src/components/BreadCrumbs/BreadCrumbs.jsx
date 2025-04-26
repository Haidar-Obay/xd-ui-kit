import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({
  className = '',
  linkClassName = '',
  separator = '/',
  activeClassName = 'font-semibold text-gray-800',
  capitalize = false,
  homeLabel = 'Home',
  truncate = false,
  maxItems = 0,
  excludeSegments = [],
  customSegments = {},
  showHome = true
}) {
  const pathname = usePathname();
  
  // Split the path into segments and remove empty segments
  const segments = pathname.split('/').filter(segment => segment !== '');
  
  // Function to format segment text
  const formatSegment = (segment) => {
    // Check if there's a custom label for this segment
    if (customSegments[segment]) {
      return customSegments[segment];
    }
    
    // Replace hyphens and underscores with spaces
    let formattedSegment = segment.replace(/[-_]/g, ' ');
    
    // Capitalize if needed
    if (capitalize) {
      formattedSegment = formattedSegment
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return formattedSegment;
  };
  
  // Filter out excluded segments
  const filteredSegments = segments.filter(segment => !excludeSegments.includes(segment));
  
  // Apply max items limit if needed
  let displayedSegments = filteredSegments;
  if (maxItems > 0 && filteredSegments.length > maxItems) {
    // Keep first and last items with an ellipsis in between
    displayedSegments = [
      ...filteredSegments.slice(0, Math.ceil(maxItems / 2) - 1),
      '...',
      ...filteredSegments.slice(-(Math.floor(maxItems / 2)))
    ];
  }
  
  // Build the breadcrumb items
  const breadcrumbItems = [];
  
  // Add home link if enabled
  if (showHome) {
    breadcrumbItems.push(
      <li key="home" className="inline-flex items-center">
        <Link href="/" className={`flex items-center text-blue-600 hover:text-blue-800 ${linkClassName}`}>
          {homeLabel === 'Home' ? (
            <>
              <Home size={16} className="mr-1" />
              <span>{homeLabel}</span>
            </>
          ) : (
            homeLabel
          )}
        </Link>
      </li>
    );
  }
  
  // Add path segments
  displayedSegments.forEach((segment, index) => {
    // For ellipsis (truncated view)
    if (segment === '...') {
      breadcrumbItems.push(
        <li key="ellipsis" className="inline-flex items-center">
          <span className="mx-2 text-gray-500">{separator}</span>
          <span className="text-gray-500">...</span>
        </li>
      );
      return;
    }
    
    // Build the link path for this segment
    const linkPath = `/${segments.slice(0, segments.indexOf(segment) + 1).join('/')}`;
    const isLast = index === displayedSegments.length - 1;
    
    breadcrumbItems.push(
      <li key={segment} className="inline-flex items-center">
        <span className="mx-2 text-gray-500">{separator}</span>
        {isLast ? (
          <span className={`${activeClassName} ${truncate ? 'truncate max-w-xs' : ''}`}>
            {formatSegment(segment)}
          </span>
        ) : (
          <Link 
            href={linkPath}
            className={`text-blue-600 hover:text-blue-800 ${linkClassName} ${truncate ? 'truncate max-w-xs' : ''}`}
          >
            {formatSegment(segment)}
          </Link>
        )}
      </li>
    );
  });
  
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center ${className}`}>
        {breadcrumbItems}
      </ol>
    </nav>
  );
}