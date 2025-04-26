import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Individual Accordion Item component
export const AccordionItem = ({
  title,
  children,
  isOpen,
  onToggle,
  disabled = false,
  icon,
  className = '',
}) => {
  return (
    <div className={`border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <button
        className={`w-full flex items-center justify-between p-4 text-left ${
          disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : isOpen 
              ? 'bg-gray-50 text-gray-900' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={onToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="font-medium">{title}</span>
        </div>
        <span className="ml-2 flex-shrink-0">
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-4 bg-white">{children}</div>
      </div>
    </div>
  );
};

// Main Accordion component
export const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  className = '',
  onChange,
}) => {
  const [openItems, setOpenItems] = useState(defaultOpen || []);

  const handleToggle = (index) => {
    setOpenItems((prev) => {
      let newOpenItems;
      
      if (allowMultiple) {
        // For multiple mode: toggle the item's presence in the array
        newOpenItems = prev.includes(index)
          ? prev.filter((item) => item !== index)
          : [...prev, index];
      } else {
        // For single mode: replace with just this item or empty array
        newOpenItems = prev.includes(index) ? [] : [index];
      }
      
      // Call onChange if provided
      if (onChange) {
        onChange(newOpenItems);
      }
      
      return newOpenItems;
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openItems.includes(index)}
          onToggle={() => !item.disabled && handleToggle(index)}
          disabled={item.disabled}
          icon={item.icon}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};