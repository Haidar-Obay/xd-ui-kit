import React from 'react';
import {
  LineChart, BarChart, PieChart, AreaChart, ScatterChart,
  Line, Bar, Pie, Area, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

/**
 * ChartCard Component
 * A flexible chart card with customizable appearance and chart options
 */
export const ChartCard = ({
  // Content props
  title,
  description,
  chartType = 'line',
  chartData = [],
  chartOptions = {},
  loading = false,
  error = '',
  height = 300,
  actions,
  
  // Style props
  cardStyle = {},
  chartWrapperStyle = {},
  variant = 'elevated',
  className = '',
  
  // Additional features
  showLegend = true,
  emptyState,
  tooltipContent,
  
  // Other props like width will be passed to ResponsiveContainer
  ...rest
}) => {
  // Determine card style based on variant
  const getCardClasses = () => {
    const baseClasses = 'rounded-lg overflow-hidden transition-shadow duration-300';
    
    switch (variant) {
      case 'flat':
        return `${baseClasses} bg-white dark:bg-gray-800`;
      case 'outlined':
        return `${baseClasses} border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`;
      case 'elevated':
      default:
        return `${baseClasses} bg-white dark:bg-gray-800 shadow-md`;
    }
  };
  
  // Get custom colors from options or use defaults
  const getColors = () => {
    return chartOptions.colors || [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
    ];
  };
  
  // Generate chart based on the chartType
  const renderChart = () => {
    const colors = getColors();
    const hasData = chartData && chartData.length > 0;
    
    // Common props for all chart types
    const commonProps = {
      data: chartData,
      margin: chartOptions.margin || { top: 10, right: 30, left: 0, bottom: 0 },
    };
    
    // Render loading skeleton
    if (loading) {
      return (
        <div className="flex flex-col w-full h-full p-4 space-y-3 animate-pulse">
          <div className="w-3/4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
          <div className="flex-1 mt-2 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
      );
    }
    
    // Render error state
    if (error) {
      return (
        <div className="flex items-center justify-center w-full h-full p-4 text-red-500">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-2 font-medium">{error}</p>
          </div>
        </div>
      );
    }
    
    // Render empty state
    if (!hasData) {
      if (emptyState) {
        return emptyState;
      }
      return (
        <div className="flex items-center justify-center w-full h-full p-4 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-2">No data available</p>
          </div>
        </div>
      );
    }
    
    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        if (tooltipContent) {
          return React.cloneElement(tooltipContent, { active, payload, label });
        }
        
        return (
          <div className="p-2 bg-white border border-gray-200 rounded shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <p className="text-sm font-medium">{`${label}`}</p>
            {payload.map((entry, index) => (
              <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
                {`${entry.name}: ${entry.value}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
  
    // Render the appropriate chart based on chartType
    switch (chartType.toLowerCase()) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%" {...rest}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey={chartOptions.xAxis || 'name'} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              {chartOptions.bars ? (
                chartOptions.bars.map((bar, index) => (
                  <Bar 
                    key={`bar-${index}`}
                    dataKey={bar.dataKey} 
                    name={bar.name || bar.dataKey}
                    fill={bar.color || colors[index % colors.length]} 
                    radius={chartOptions.rounded ? [4, 4, 0, 0] : 0}
                  />
                ))
              ) : (
                <Bar 
                  dataKey={chartOptions.dataKey || 'value'} 
                  fill={colors[0]} 
                  radius={chartOptions.rounded ? [4, 4, 0, 0] : 0}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%" {...rest}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={chartOptions.labelLine !== false}
                label={chartOptions.showLabels !== false}
                outerRadius={chartOptions.outerRadius || "80%"}
                innerRadius={chartOptions.innerRadius || 0}
                dataKey={chartOptions.dataKey || 'value'}
                nameKey={chartOptions.nameKey || 'name'}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%" {...rest}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey={chartOptions.xAxis || 'name'} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              {chartOptions.areas ? (
                chartOptions.areas.map((area, index) => (
                  <Area 
                    key={`area-${index}`}
                    type="monotone" 
                    dataKey={area.dataKey} 
                    name={area.name || area.dataKey}
                    stroke={area.color || colors[index % colors.length]} 
                    fill={area.color || colors[index % colors.length]}
                    fillOpacity={0.2}
                  />
                ))
              ) : (
                <Area 
                  type="monotone" 
                  dataKey={chartOptions.dataKey || 'value'} 
                  stroke={colors[0]} 
                  fill={colors[0]}
                  fillOpacity={0.2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%" {...rest}>
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey={chartOptions.xAxis || 'x'} 
                type="number" 
                name={chartOptions.xAxisName || 'X'} 
              />
              <YAxis 
                dataKey={chartOptions.yAxis || 'y'} 
                type="number" 
                name={chartOptions.yAxisName || 'Y'} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
              {showLegend && <Legend />}
              {chartOptions.scatters ? (
                chartOptions.scatters.map((scatter, index) => (
                  <Scatter 
                    key={`scatter-${index}`}
                    name={scatter.name || `Dataset ${index + 1}`} 
                    data={scatter.data || chartData}
                    fill={scatter.color || colors[index % colors.length]} 
                  />
                ))
              ) : (
                <Scatter 
                  name="Values" 
                  data={chartData}
                  fill={colors[0]} 
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'line':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%" {...rest}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey={chartOptions.xAxis || 'name'} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              {chartOptions.lines ? (
                chartOptions.lines.map((line, index) => (
                  <Line 
                    key={`line-${index}`}
                    type="monotone" 
                    dataKey={line.dataKey} 
                    name={line.name || line.dataKey}
                    stroke={line.color || colors[index % colors.length]} 
                    strokeWidth={line.strokeWidth || 2}
                    dot={line.showDot !== false}
                    activeDot={{ r: 8 }}
                  />
                ))
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={chartOptions.dataKey || 'value'} 
                  stroke={colors[0]} 
                  strokeWidth={2}
                  dot={chartOptions.showDot !== false}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div 
      className={`${getCardClasses()} ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height, ...cardStyle }}
    >
      {/* Header */}
      {(title || description || actions) && (
        <div className="flex items-start justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      
      {/* Chart content */}
      <div 
        className="flex-1 overflow-hidden"
        style={{ 
          height: title || description || actions ? `calc(100% - ${(title || description) && actions ? '70px' : '60px'})` : '100%',
          ...chartWrapperStyle 
        }}
      >
        {renderChart()}
      </div>
    </div>
  );
};