import React, { useState } from 'react';

export const Checkbox = ({
    label,
    checked = false,
    onChange,
    error = '',
    disabled = false,
    required = false,
    className = '',
    id,
    name,
  }) => {
    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`} htmlFor={id}>
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    );
  };
  
  // CheckboxGroup component
  export const CheckboxGroup = ({
    label,
    options = [],
    value = [],
    onChange,
    error = '',
    disabled = false,
    required = false,
    className = '',
    name,
    inline = false,
  }) => {
    const handleChange = (optionValue) => {
      const newValue = [...value];
      
      if (newValue.includes(optionValue)) {
        // Remove if already selected
        const index = newValue.indexOf(optionValue);
        newValue.splice(index, 1);
      } else {
        // Add if not selected
        newValue.push(optionValue);
      }
      
      if (onChange) {
        onChange({ target: { name, value: newValue } });
      }
    };
  
    return (
      <div className={`w-full mb-4 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className={`${inline ? 'flex flex-wrap gap-4' : 'space-y-2'}`}>
          {options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            
            return (
              <Checkbox
                key={index}
                id={`${name}-${index}`}
                name={`${name}-${index}`}
                label={optionLabel}
                checked={value.includes(optionValue)}
                onChange={() => handleChange(optionValue)}
                disabled={disabled || (option.disabled === true)}
              />
            );
          })}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };
  
  // Form demo component that showcases all the form elements
  export default function FormComponentsDemo() {
    const [formState, setFormState] = useState({
      username: '',
      password: '',
      search: '',
      bio: '',
      country: '',
      interests: [],
      termsAccepted: false
    });
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormState(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
    
    const countryOptions = [
      { value: 'usa', label: 'United States' },
      { value: 'can', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'aus', label: 'Australia' },
      { value: 'ger', label: 'Germany' },
      { value: 'fra', label: 'France' },
      { value: 'jpn', label: 'Japan' }
    ];
    
    const interestOptions = [
      { value: 'tech', label: 'Technology' },
      { value: 'music', label: 'Music' },
      { value: 'sports', label: 'Sports' },
      { value: 'reading', label: 'Reading' },
      { value: 'travel', label: 'Travel' },
      { value: 'food', label: 'Food' }
    ];
  
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Components Demo</h2>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Text Inputs</h3>
          
          <Input
            label="Username"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formState.username}
            onChange={handleChange}
            required
            clearable
          />
          
          <Input
            type="password"
            label="Password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formState.password}
            onChange={handleChange}
            required
          />
          
          <Input
            type="search"
            label="Search"
            id="search"
            name="search"
            placeholder="Search..."
            value={formState.search}
            onChange={handleChange}
            clearable
          />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">TextArea</h3>
          
          <TextArea
            label="Bio"
            id="bio"
            name="bio"
            placeholder="Tell us about yourself"
            value={formState.bio}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Select (Dropdown)</h3>
          
          <Select
            label="Country"
            id="country"
            name="country"
            options={countryOptions}
            value={formState.country}
            onChange={handleChange}
            placeholder="Select your country"
            searchable
            clearable
          />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Checkboxes</h3>
          
          <CheckboxGroup
            label="Interests"
            name="interests"
            options={interestOptions}
            value={formState.interests}
            onChange={handleChange}
            inline
          />
          
          <div className="mt-4">
            <Checkbox
              label="I accept the terms and conditions"
              id="terms"
              name="termsAccepted"
              checked={formState.termsAccepted}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Form Data Preview:</h3>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(formState, null, 2)}
          </pre>
        </div>
      </div>
    );
  }