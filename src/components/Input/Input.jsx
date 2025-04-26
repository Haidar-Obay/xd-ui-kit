import React, { useState, useEffect } from 'react';
import { Search, Eye, EyeOff, X } from 'lucide-react';

export const Input = ({
  type = '',
  label,
  placeholder = '',
  value = '',
  onChange,
  error = '',
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  icon,
  clearable = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  useEffect(() => {
    if (type === 'password') {
      setInputType(showPassword ? 'text' : 'password');
    }
  }, [showPassword, type]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    setInputValue('');
    if (onChange) onChange({ target: { value: '', name } });
  };

  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {type === 'search' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
        )}
        {icon && !type === 'search' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          id={id}
          name={name}
          className={`block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 ${
            type === 'search' ? 'pl-10' : icon ? 'pl-10' : ''
          } ${error ? 'border-red-500' : ''} ${clearable && inputValue ? 'pr-10' : type === 'password' ? 'pr-10' : ''} ${className}`}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
          </button>
        )}
        {clearable && inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            <X size={18} className="text-gray-400" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};