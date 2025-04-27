import React, { useState, useEffect, createContext, useContext, useRef } from "react";

// Create a context for managing dialogs
const ConfirmDialogContext = createContext();

// Provider component that wraps your app
export function ConfirmDialogProvider({ children }) {
  const [dialogs, setDialogs] = useState([]);
  const idCounter = useRef(0);

  const createDialog = (options) => {
    return new Promise((resolve) => {
      const id = idCounter.current++;
      const dialog = {
        id,
        ...options,
        onConfirm: () => {
          resolve(true);
          closeDialog(id);
        },
        onCancel: () => {
          resolve(false);
          closeDialog(id);
        },
        onClose: () => {
          resolve(false);
          closeDialog(id);
        }
      };
      
      setDialogs((dialogs) => [...dialogs, dialog]);
    });
  };

  const closeDialog = (id) => {
    setDialogs((dialogs) => 
      dialogs.map(dialog => 
        dialog.id === id ? { ...dialog, isClosing: true } : dialog
      )
    );
    
    // Remove dialog from state after animation completes
    setTimeout(() => {
      setDialogs((dialogs) => dialogs.filter(dialog => dialog.id !== id));
    }, 300); // Match transition duration
  };

  return (
    <ConfirmDialogContext.Provider value={{ createDialog }}>
      {children}
      {dialogs.map((dialog) => (
        <ConfirmDialog key={dialog.id} {...dialog} />
      ))}
    </ConfirmDialogContext.Provider>
  );
}

// Hook to use confirm dialog
export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider");
  }
  
  const confirm = ({
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "question", // question, warning, danger, success, info
    icon = true,
    closeOnOverlayClick = true,
    confirmButtonColor = "",
    cancelButtonColor = "",
    size = "md", // sm, md, lg
    position = "center", // center, top
    hideCancel = false,
    customContent = null
  } = {}) => {
    return context.createDialog({
      title,
      message,
      confirmText,
      cancelText,
      type,
      icon,
      closeOnOverlayClick,
      confirmButtonColor,
      cancelButtonColor,
      size,
      position,
      hideCancel,
      customContent
    });
  };
  
  return { confirm };
}

// The actual dialog component
function ConfirmDialog({
  id,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose,
  type,
  icon,
  closeOnOverlayClick,
  confirmButtonColor,
  cancelButtonColor,
  size,
  position,
  hideCancel,
  customContent,
  isClosing = false
}) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);
  
  // Focus trap and keyboard navigation
  useEffect(() => {
    setMounted(true);
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      } else if (e.key === "Tab") {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    // Auto-focus first button when dialog opens
    const timer = setTimeout(() => {
      const firstButton = dialogRef.current?.querySelector("button");
      if (firstButton) firstButton.focus();
    }, 100);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [onCancel, onConfirm]);
  
  // Type-specific styling
  const typeStyles = {
    question: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "border-blue-200 bg-blue-50",
      confirmButton: confirmButtonColor || "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    },
    warning: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "border-yellow-200 bg-yellow-50",
      confirmButton: confirmButtonColor || "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
    },
    danger: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "border-red-200 bg-red-50",
      confirmButton: confirmButtonColor || "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    },
    success: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "border-green-200 bg-green-50",
      confirmButton: confirmButtonColor || "bg-green-600 hover:bg-green-700 focus:ring-green-500"
    },
    info: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "border-blue-200 bg-blue-50",
      confirmButton: confirmButtonColor || "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
    }
  };
  
  // Size classes for dialog
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl"
  };
  
  // Position classes
  const positionClasses = {
    center: "items-center",
    top: "items-start pt-16"
  };
  
  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };
  
  // Rendered dialog content
  return (
    <div 
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${mounted && !isClosing ? "opacity-100" : "opacity-0"}`}
      aria-labelledby={`dialog-title-${id}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 transition-opacity bg-black/50"
        onClick={handleOverlayClick}
      ></div>
      
      {/* Dialog positioning */}
      <div className={`flex min-h-full justify-center p-4 text-center ${positionClasses[position] || "items-center"}`}>
        {/* Dialog panel */}
        <div 
          ref={dialogRef}
          className={`relative transform overflow-hidden rounded-lg border text-left align-middle shadow-xl transition-all duration-300 ${sizeClasses[size] || "max-w-lg"} ${typeStyles[type]?.color || "bg-white"} ${mounted && !isClosing ? "translate-y-0" : "translate-y-8"} w-full`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              {icon && typeStyles[type]?.icon && (
                <div className="flex-shrink-0">
                  {typeStyles[type].icon}
                </div>
              )}
              
              <div className="flex-1">
                <h3 
                  className="text-lg font-medium leading-6 text-gray-900" 
                  id={`dialog-title-${id}`}
                >
                  {title}
                </h3>
                
                {/* Message */}
                {message && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                )}
                
                {/* Custom content */}
                {customContent && (
                  <div className="mt-4">
                    {customContent}
                  </div>
                )}
              </div>
              
              {/* Close button */}
              <button
                className="text-gray-400 bg-transparent rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end gap-3 mt-6">
              {!hideCancel && (
                <button
                  type="button"
                  className={`inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${cancelButtonColor}`}
                  onClick={onCancel}
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeStyles[type]?.confirmButton || "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

