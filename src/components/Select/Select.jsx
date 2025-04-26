import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';  
  
  // Select component (dropdown)
  export const Select = ({
    label,
    options = [],
    value = '',
    onChange,
    error = '',
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    placeholder = '',
    searchable = false,
    clearable = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayValue, setDisplayValue] = useState('');
  
    // Update display value when value changes or on mount
    useEffect(() => {
      if (value === '' && clearable) {
        setDisplayValue('');
        setSelectedValue('');
        return;
      }
      
      const selected = options.find(option => 
        typeof option === 'object' ? option.value === value : option === value
      );
      
      if (selected) {
        setSelectedValue(typeof selected === 'object' ? selected.value : selected);
        setDisplayValue(typeof selected === 'object' ? selected.label : selected);
      } else {
        setDisplayValue(placeholder);
      }
    }, [value, options, placeholder, clearable]);
  
    const handleSelect = (option) => {
      const newValue = typeof option === 'object' ? option.value : option;
      const newLabel = typeof option === 'object' ? option.label : option;
      
      setSelectedValue(newValue);
      setDisplayValue(newLabel);
      setIsOpen(false);
      setSearchTerm('');
      
      if (onChange) {
        onChange({ target: { name, value: newValue } });
      }
    };
  
    const handleClear = (e) => {
      e.stopPropagation();
      setSelectedValue('');
      setDisplayValue('');
      
      if (onChange) {
        onChange({ target: { name, value: '' } });
      }
    };
  
    const filteredOptions = searchable && searchTerm 
      ? options.filter(option => {
          const label = typeof option === 'object' ? option.label : option;
          return label.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : options;
  
    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <div
            className={`block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 ${
              error ? 'border-red-500' : ''
            } ${className} cursor-pointer flex justify-between items-center`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <span className={displayValue === placeholder ? 'text-gray-400' : ''}>{displayValue || placeholder}</span>
            <div className="flex items-center">
              {clearable && selectedValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="mr-2"
                  tabIndex={-1}
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <ul>
                {clearable && (
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSelect({ value: '', label: '' })}
                  >
                    <span>Clear selection</span>
                  </li>
                )}
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const optionValue = typeof option === 'object' ? option.value : option;
                    const optionLabel = typeof option === 'object' ? option.label : option;
                    const isSelected = optionValue === selectedValue;
                    
                    return (
                      <li 
                        key={index} 
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${isSelected ? 'bg-indigo-50' : ''}`}
                        onClick={() => handleSelect(option)}
                      >
                        <span>{optionLabel}</span>
                        {isSelected && <Check size={16} className="text-indigo-600" />}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-2 text-gray-500">No options available</li>
                )}
              </ul>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };