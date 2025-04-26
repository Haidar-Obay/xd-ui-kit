import { useState } from 'react';

export default function Pagination({
  totalItems = 100,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  maxPages = 5,
  size = "md",
  variant = "default",
  showFirstLast = true,
  showPrevNext = true,
  firstLabel = "«",
  prevLabel = "‹",
  nextLabel = "›",
  lastLabel = "»",
  align = "center",
  showPageInfo = false,
  pageInfoTemplate = "Page {current} of {total}",
  showJumpInput = false,
  i18n = {
    jumpLabel: "Go to page",
    jumpButtonLabel: "Go"
  },
  showItemsPerPageSelector = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  onItemsPerPageChange,
  disableTransitions = false,
  className = "",
  ariaLabel = "Pagination"
}) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Internal states
  const [internalPage, setInternalPage] = useState(currentPage);
  const [jumpValue, setJumpValue] = useState("");
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(itemsPerPage);
  
  // Use provided current page if component is controlled
  const page = onPageChange ? currentPage : internalPage;
  const perPage = onItemsPerPageChange ? itemsPerPage : internalItemsPerPage;
  
  // Handle page changes
  const handlePageChange = (newPage) => {
    // Enforce boundaries
    if (newPage < 1 || newPage > totalPages) return;
    
    // Update internal state if uncontrolled
    if (!onPageChange) {
      setInternalPage(newPage);
    }
    // Call the callback if provided
    else {
      onPageChange(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newValue) => {
    const newPerPage = parseInt(newValue, 10);
    
    if (!onItemsPerPageChange) {
      setInternalItemsPerPage(newPerPage);
      // Adjust current page to maintain position
      const firstItemIndex = (page - 1) * perPage;
      const newPage = Math.floor(firstItemIndex / newPerPage) + 1;
      handlePageChange(newPage);
    } else {
      onItemsPerPageChange(newPerPage);
    }
  };
  
  // Handle jump to page
  const handleJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpValue("");
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-1 min-w-6",
    md: "text-sm px-3 py-1.5 min-w-8",
    lg: "text-base px-4 py-2 min-w-10"
  };
  
  // Input size classes
  const inputSizeClasses = {
    sm: "text-xs h-6 w-12",
    md: "text-sm h-8 w-16",
    lg: "text-base h-10 w-20"
  };
  
  // Variant classes
  const variantClasses = {
    default: {
      container: "bg-white",
      button: "bg-white hover:bg-gray-100",
      active: "bg-blue-500 text-white hover:bg-blue-600",
      disabled: "text-gray-300 cursor-not-allowed"
    },
    outline: {
      container: "bg-transparent",
      button: "border border-gray-300 bg-white hover:bg-gray-50",
      active: "border border-blue-500 bg-blue-500 text-white hover:bg-blue-600",
      disabled: "border border-gray-200 text-gray-300 cursor-not-allowed"
    },
    rounded: {
      container: "bg-transparent",
      button: "bg-white hover:bg-gray-100 rounded-full",
      active: "bg-blue-500 text-white hover:bg-blue-600 rounded-full",
      disabled: "text-gray-300 cursor-not-allowed rounded-full"
    },
    minimal: {
      container: "bg-transparent",
      button: "text-gray-700 hover:text-blue-500",
      active: "text-blue-500 font-medium",
      disabled: "text-gray-300 cursor-not-allowed"
    },
    pills: {
      container: "bg-transparent",
      button: "bg-gray-100 hover:bg-gray-200 rounded-md",
      active: "bg-blue-500 text-white hover:bg-blue-600 rounded-md",
      disabled: "bg-gray-50 text-gray-300 cursor-not-allowed rounded-md"
    },
    ghost: {
      container: "bg-transparent",
      button: "text-gray-600 hover:bg-gray-100",
      active: "bg-gray-100 text-blue-500 font-medium",
      disabled: "text-gray-300 cursor-not-allowed"
    }
  };
  
  // Alignment classes
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between"
  };
  
  // Button styling
  const transitionClass = disableTransitions ? "" : "transition-colors duration-150";
  const buttonBaseClasses = `flex items-center justify-center ${sizeClasses[size]} focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${transitionClass}`;
  
  // Get variant classes
  const { container, button, active, disabled } = variantClasses[variant] || variantClasses.default;
  
  // Generate page numbers to display
  const getVisiblePageNumbers = () => {
    // For small number of pages, show all
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, page - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;
    
    // Adjust if end page is beyond total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  // Format page info text
  const formatPageInfo = (template) => {
    return template
      .replace('{current}', page)
      .replace('{total}', totalPages)
      .replace('{first}', Math.min(((page - 1) * perPage) + 1, totalItems))
      .replace('{last}', Math.min(page * perPage, totalItems))
      .replace('{count}', totalItems);
  };
  
  // Get page numbers to display
  const visiblePageNumbers = getVisiblePageNumbers();
  
  return (
    <div className={`flex flex-wrap items-center gap-2 ${container} ${className}`} 
         role="navigation" 
         aria-label={ariaLabel}>
      <div className={`flex items-center gap-1 ${alignClasses[align]}`}>
        {/* First page button */}
        {showFirstLast && (
          <button 
            className={`${buttonBaseClasses} ${page === 1 ? disabled : button}`}
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            aria-label="Go to first page"
          >
            {firstLabel}
          </button>
        )}
        
        {/* Previous page button */}
        {showPrevNext && (
          <button 
            className={`${buttonBaseClasses} ${page === 1 ? disabled : button}`}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Go to previous page"
          >
            {prevLabel}
          </button>
        )}
        
        {/* Page numbers */}
        {visiblePageNumbers[0] > 1 && (
          <>
            <button 
              className={`${buttonBaseClasses} ${button}`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {visiblePageNumbers[0] > 2 && (
              <span className="px-1 text-gray-500">...</span>
            )}
          </>
        )}
        
        {visiblePageNumbers.map(pageNum => (
          <button
            key={pageNum}
            className={`${buttonBaseClasses} ${pageNum === page ? active : button}`}
            onClick={() => handlePageChange(pageNum)}
            aria-current={pageNum === page ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}
        
        {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
          <>
            {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-500">...</span>
            )}
            <button 
              className={`${buttonBaseClasses} ${button}`}
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        {/* Next page button */}
        {showPrevNext && (
          <button 
            className={`${buttonBaseClasses} ${page === totalPages ? disabled : button}`}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Go to next page"
          >
            {nextLabel}
          </button>
        )}
        
        {/* Last page button */}
        {showFirstLast && (
          <button 
            className={`${buttonBaseClasses} ${page === totalPages ? disabled : button}`}
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            aria-label="Go to last page"
          >
            {lastLabel}
          </button>
        )}
      </div>
      
      {/* Page info text */}
      {showPageInfo && (
        <div className="ml-2 text-gray-600 text-sm">
          {formatPageInfo(pageInfoTemplate)}
        </div>
      )}
      
      {/* Jump to page input */}
      {showJumpInput && (
        <form onSubmit={handleJump} className="flex items-center ml-2">
          <label htmlFor="jump-input" className="text-sm text-gray-600 mr-1">{i18n.jumpLabel}:</label>
          <input
            id="jump-input"
            type="number"
            min="1"
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            className={`${inputSizeClasses[size]} border border-gray-300 rounded px-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          <button
            type="submit"
            className={`${buttonBaseClasses} ${button} ml-1`}
          >
            {i18n.jumpButtonLabel}
          </button>
        </form>
      )}
      
      {/* Items per page selector */}
      {showItemsPerPageSelector && (
        <div className="flex items-center ml-2">
          <label className="text-sm text-gray-600 mr-1">Items per page:</label>
          <select
            value={perPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className={`${inputSizeClasses[size]} border border-gray-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}