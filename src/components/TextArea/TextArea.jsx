import React from 'react';

export const TextArea = ({
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
    rows ='',
  }) => {
    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={id}
          name={name}
          rows={rows}
          className={`block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };
  
