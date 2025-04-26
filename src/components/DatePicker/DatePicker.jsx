import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

export const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date...',
  format = 'MM/DD/YYYY',
  label,
  error,
  required = false,
  locale = 'en',
  openToDate,
  showTimeSelect = false,
  name,
  isClearable = true,
  todayButton = true
}) => {
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [displayDate, setDisplayDate] = useState(openToDate ? new Date(openToDate) : new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [timeValues, setTimeValues] = useState({ hours: 0, minutes: 0 });
  const calendarRef = useRef(null);

  // Set up locale
  const dateLocale = new Intl.DateTimeFormat(locale, { month: 'long' });
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    // Update selected date when value prop changes
    if (value) {
      const newDate = new Date(value);
      setSelectedDate(newDate);
      
      if (showTimeSelect) {
        setTimeValues({
          hours: newDate.getHours(),
          minutes: newDate.getMinutes()
        });
      }
    } else {
      setSelectedDate(null);
    }
  }, [value, showTimeSelect]);

  useEffect(() => {
    // Handle clicks outside the calendar to close it
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date according to the format string
  const formatDate = (date) => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let formattedDate = format;
    formattedDate = formattedDate.replace('MM', month);
    formattedDate = formattedDate.replace('DD', day);
    formattedDate = formattedDate.replace('YYYY', year);
    
    if (showTimeSelect) {
      const hours = timeValues.hours.toString().padStart(2, '0');
      const minutes = timeValues.minutes.toString().padStart(2, '0');
      formattedDate += ` ${hours}:${minutes}`;
    }
    
    return formattedDate;
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0-6, 0 is Sunday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const nextMonth = () => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Check if a date is disabled
  const isDateDisabled = (date) => {
    if (disabled) return true;
    
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    
    return false;
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const newDate = new Date(
      displayDate.getFullYear(),
      displayDate.getMonth(),
      day
    );
    
    if (showTimeSelect) {
      newDate.setHours(timeValues.hours);
      newDate.setMinutes(timeValues.minutes);
    }
    
    setSelectedDate(newDate);
    onChange(newDate);
    
    if (!showTimeSelect) {
      setIsOpen(false);
    }
  };

  // Handle time change
  const handleTimeChange = (type, value) => {
    const newTimeValues = { ...timeValues };
    
    if (type === 'hours') {
      newTimeValues.hours = parseInt(value, 10);
    } else {
      newTimeValues.minutes = parseInt(value, 10);
    }
    
    setTimeValues(newTimeValues);
    
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(newTimeValues.hours);
      newDate.setMinutes(newTimeValues.minutes);
      onChange(newDate);
    }
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setDisplayDate(today);
    if (!isDateDisabled(today)) {
      handleDateSelect(today.getDate());
    }
  };

  // Clear selected date
  const clearDate = () => {
    setSelectedDate(null);
    onChange(null);
    setIsOpen(false);
  };

  // Render calendar
  const renderCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm 
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'} 
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''} 
            ${isToday && !isSelected ? 'border border-blue-500' : ''}`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  // Render time picker
  const renderTimePicker = () => {
    return (
      <div className="p-2 mt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <select
            value={timeValues.hours}
            onChange={(e) => handleTimeChange('hours', e.target.value)}
            className="w-16 p-1 text-sm border border-gray-300 rounded"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
            ))}
          </select>
          <span>:</span>
          <select
            value={timeValues.minutes}
            onChange={(e) => handleTimeChange('minutes', e.target.value)}
            className="w-16 p-1 text-sm border border-gray-300 rounded"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative" ref={calendarRef}>
        <div 
          className={`flex items-center border rounded-md px-3 py-2 cursor-pointer 
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'} 
            ${error ? 'border-red-300' : 'border-gray-300'}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <Calendar size={16} className="mr-2 text-gray-400" />
          <input
            type="text"
            name={name}
            readOnly
            disabled={disabled}
            placeholder={placeholder}
            value={selectedDate ? formatDate(selectedDate) : ''}
            className="flex-grow bg-transparent outline-none cursor-pointer disabled:cursor-not-allowed"
          />
          {isClearable && selectedDate && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearDate();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        {isOpen && (
          <div className="absolute z-10 w-64 p-3 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="font-medium">
                {dateLocale.format(displayDate).split(' ')[0]} {displayDate.getFullYear()}
              </div>
              <button
                onClick={nextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
            
            {showTimeSelect && renderTimePicker()}
            
            <div className="flex justify-between mt-4">
              {todayButton && (
                <button
                  onClick={goToToday}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Today
                </button>
              )}
              
              {isClearable && (
                <button
                  onClick={clearDate}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
