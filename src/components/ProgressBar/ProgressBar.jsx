import React, { useState, useEffect } from "react";

export const ProgressBar = ({
  // Core functionality
  progress = 0,
  total = 100,
  showPercentage = true,
  autoCalculatePercentage = true,
  
  // Styling options
  height = 10,
  barColor = "#3b82f6", // Default blue
  backgroundColor = "#e5e7eb",
  borderRadius = 9999,
  transitionDuration = 300,
  boxShadow = false,
  
  // Label options
  label = "",
  labelPosition = "top", // "top", "inside", "bottom"
  labelStyle = {},
  
  // Additional features
  striped = false,
  animated = false,
  indeterminate = false,
  
  // Status indicators
  showStatus = false,
  status = "normal", // "normal", "success", "error", "warning"
  statusIcon = true,
  
  // Extra
  className = "",
  style = {},
}) => {
  const [calculatedProgress, setCalculatedProgress] = useState(
    autoCalculatePercentage ? (progress / total) * 100 : progress
  );
  
  useEffect(() => {
    setCalculatedProgress(
      autoCalculatePercentage ? (progress / total) * 100 : progress
    );
  }, [progress, total, autoCalculatePercentage]);
  
  // Ensure progress is within bounds
  const normalizedProgress = Math.min(Math.max(calculatedProgress, 0), 100);
  
  // Status color mapping
  const statusColors = {
    normal: barColor,
    success: "#10b981", // Green
    error: "#ef4444",   // Red
    warning: "#f59e0b", // Amber
  };
  
  // Status icons
  const StatusIcon = () => {
    if (!statusIcon) return null;
    
    if (status === "success") {
      return (
        <div className="ml-2 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
      );
    } else if (status === "error") {
      return (
        <div className="ml-2 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
      );
    } else if (status === "warning") {
      return (
        <div className="ml-2 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      );
    }
    
    return null;
  };
  
  // Generate classes for the progress bar container
  const containerClasses = `relative ${className}`;
  
  // Generate classes for the progress bar
  const progressBarClasses = `
    ${indeterminate ? "animate-pulse" : ""}
    ${striped ? "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px]" : ""}
    ${animated && !indeterminate ? "animate-[progress_2s_linear_infinite]" : ""}
  `;
  
  const renderLabel = () => {
    if (!label && !showPercentage) return null;
    
    const displayText = `${label}${label && showPercentage ? ": " : ""}${showPercentage ? `${Math.round(normalizedProgress)}%` : ""}`;
    
    const labelClasses = `text-sm font-medium flex items-center ${
      labelPosition === "inside" ? "absolute left-2 text-white" : ""
    }`;
    
    if (labelPosition === "top") {
      return (
        <div className={`mb-1 ${labelClasses}`} style={labelStyle}>
          {displayText}
          {showStatus && <StatusIcon />}
        </div>
      );
    } else if (labelPosition === "bottom") {
      return (
        <div className={`mt-1 ${labelClasses}`} style={labelStyle}>
          {displayText}
          {showStatus && <StatusIcon />}
        </div>
      );
    } else if (labelPosition === "inside") {
      return (
        <div 
          className={labelClasses} 
          style={{ 
            ...labelStyle, 
            top: "50%", 
            transform: "translateY(-50%)" 
          }}
        >
          {displayText}
          {showStatus && <StatusIcon />}
        </div>
      );
    }
    
    return null;
  };
  
  const renderIndeterminateBar = () => {
    return (
      <div 
        className="absolute w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
        style={{
          animation: "indeterminate 1.5s infinite linear",
          backgroundSize: "200% 100%"
        }}
      />
    );
  };
  
  return (
    <div className={containerClasses} style={style}>
      {labelPosition === "top" && renderLabel()}
      
      <div 
        className="relative overflow-hidden"
        style={{ 
          height: `${height}px`, 
          backgroundColor: backgroundColor,
          borderRadius: `${borderRadius}px`,
          boxShadow: boxShadow ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none"
        }}
      >
        <div 
          className={progressBarClasses}
          style={{ 
            height: "100%",
            width: indeterminate ? "100%" : `${normalizedProgress}%`,
            backgroundColor: statusColors[status] || barColor,
            borderRadius: `${borderRadius}px`,
            transition: `width ${transitionDuration}ms ease-in-out`
          }}
        >
          {indeterminate && renderIndeterminateBar()}
          {labelPosition === "inside" && renderLabel()}
        </div>
      </div>
      
      {labelPosition === "bottom" && renderLabel()}
    </div>
  );
};

