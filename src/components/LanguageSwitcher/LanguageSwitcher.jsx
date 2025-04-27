import { useState, useEffect, useRef } from "react";
import { Globe, Check, ChevronDown, Search, X, Settings, Clock } from "lucide-react";

// Extended language list with regions and more options
const languages = [
    // Europe
    { code: "en", name: "English", localName: "English", flag: "🇺🇸", region: "Europe", rtl: false, popular: true },
    { code: "en-GB", name: "English (UK)", localName: "English (UK)", flag: "🇬🇧", region: "Europe", rtl: false, popular: true },
    { code: "es", name: "Spanish", localName: "Español", flag: "🇪🇸", region: "Europe", rtl: false, popular: true },
    { code: "fr", name: "French", localName: "Français", flag: "🇫🇷", region: "Europe", rtl: false, popular: true },
    { code: "de", name: "German", localName: "Deutsch", flag: "🇩🇪", region: "Europe", rtl: false, popular: true },
    { code: "it", name: "Italian", localName: "Italiano", flag: "🇮🇹", region: "Europe", rtl: false, popular: true },
    { code: "pt", name: "Portuguese", localName: "Português", flag: "🇵🇹", region: "Europe", rtl: false, popular: true },
    { code: "nl", name: "Dutch", localName: "Nederlands", flag: "🇳🇱", region: "Europe", rtl: false },
    { code: "pl", name: "Polish", localName: "Polski", flag: "🇵🇱", region: "Europe", rtl: false },
    { code: "sv", name: "Swedish", localName: "Svenska", flag: "🇸🇪", region: "Europe", rtl: false },
    { code: "no", name: "Norwegian", localName: "Norsk", flag: "🇳🇴", region: "Europe", rtl: false },
    { code: "da", name: "Danish", localName: "Dansk", flag: "🇩🇰", region: "Europe", rtl: false },
    { code: "fi", name: "Finnish", localName: "Suomi", flag: "🇫🇮", region: "Europe", rtl: false },
    { code: "el", name: "Greek", localName: "Ελληνικά", flag: "🇬🇷", region: "Europe", rtl: false },
    { code: "hu", name: "Hungarian", localName: "Magyar", flag: "🇭🇺", region: "Europe", rtl: false },
    { code: "cs", name: "Czech", localName: "Čeština", flag: "🇨🇿", region: "Europe", rtl: false },
    { code: "ro", name: "Romanian", localName: "Română", flag: "🇷🇴", region: "Europe", rtl: false },
    { code: "bg", name: "Bulgarian", localName: "Български", flag: "🇧🇬", region: "Europe", rtl: false },
    { code: "uk", name: "Ukrainian", localName: "Українська", flag: "🇺🇦", region: "Europe", rtl: false },
    { code: "ru", name: "Russian", localName: "Русский", flag: "🇷🇺", region: "Europe", rtl: false, popular: true },
    
    // Asia
    { code: "zh", name: "Chinese (Simplified)", localName: "中文 (简体)", flag: "🇨🇳", region: "Asia", rtl: false, popular: true },
    { code: "zh-TW", name: "Chinese (Traditional)", localName: "中文 (繁體)", flag: "🇹🇼", region: "Asia", rtl: false },
    { code: "ja", name: "Japanese", localName: "日本語", flag: "🇯🇵", region: "Asia", rtl: false, popular: true },
    { code: "ko", name: "Korean", localName: "한국어", flag: "🇰🇷", region: "Asia", rtl: false, popular: true },
    { code: "hi", name: "Hindi", localName: "हिन्दी", flag: "🇮🇳", region: "Asia", rtl: false, popular: true },
    { code: "th", name: "Thai", localName: "ไทย", flag: "🇹🇭", region: "Asia", rtl: false },
    { code: "vi", name: "Vietnamese", localName: "Tiếng Việt", flag: "🇻🇳", region: "Asia", rtl: false },
    { code: "id", name: "Indonesian", localName: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia", rtl: false },
    { code: "ms", name: "Malay", localName: "Bahasa Melayu", flag: "🇲🇾", region: "Asia", rtl: false },
    { code: "bn", name: "Bengali", localName: "বাংলা", flag: "🇧🇩", region: "Asia", rtl: false },
    { code: "ta", name: "Tamil", localName: "தமிழ்", flag: "🇮🇳", region: "Asia", rtl: false },
    
    // Middle East
    { code: "ar", name: "Arabic", localName: "العربية", flag: "🇸🇦", region: "Middle East", rtl: true, popular: true },
    { code: "fa", name: "Persian", localName: "فارسی", flag: "🇮🇷", region: "Middle East", rtl: true },
    { code: "tr", name: "Turkish", localName: "Türkçe", flag: "🇹🇷", region: "Middle East", rtl: false },
    
    // Africa
    { code: "sw", name: "Swahili", localName: "Kiswahili", flag: "🇰🇪", region: "Africa", rtl: false },
    { code: "am", name: "Amharic", localName: "አማርኛ", flag: "🇪🇹", region: "Africa", rtl: false },
    { code: "ha", name: "Hausa", localName: "Hausa", flag: "🇳🇬", region: "Africa", rtl: false },
    
    // Americas
    { code: "es-MX", name: "Spanish (Mexico)", localName: "Español (México)", flag: "🇲🇽", region: "Americas", rtl: false },
    { code: "pt-BR", name: "Portuguese (Brazil)", localName: "Português (Brasil)", flag: "🇧🇷", region: "Americas", rtl: false },
  ];  

// Function to get language preference from local storage or browser settings
const getInitialLanguage = () => {
  // Try to get from localStorage first
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage) {
    const language = languages.find(lang => lang.code === savedLanguage);
    if (language) return language;
  }
  
  // Try to get from browser settings
  const browserLang = navigator.language || navigator.userLanguage;
  const exactMatch = languages.find(lang => lang.code === browserLang);
  if (exactMatch) return exactMatch;
  
  // Try to match just the primary language code
  const primaryCode = browserLang.split('-')[0];
  const primaryMatch = languages.find(lang => lang.code === primaryCode);
  if (primaryMatch) return primaryMatch;
  
  // Default to English
  return languages[0];
};

// Get unique regions for filtering
const regions = [...new Set(languages.map(lang => lang.region))];

export const LanguageSwitcher = ({ 
  onChange = () => {}, 
  showLocalNames = true,
  compact = false,
  darkMode = false,
  position = "bottom-left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [showRegions, setShowRegions] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [showSettings, setShowSettings] = useState(false);
  const [recentLanguages, setRecentLanguages] = useState([]);
  const dropdownRef = useRef(null);

  // Determine dropdown position classes
  const getPositionClasses = () => {
    switch (position) {
      case "top-left": return "bottom-full right-0 mb-2";
      case "top-right": return "bottom-full left-0 mb-2";
      case "bottom-right": return "top-full left-0 mt-2";
      default: return "top-full right-0 mt-2"; // bottom-left (default)
    }
  };

  // Theme classes based on dark mode
  const themeClasses = {
    button: darkMode 
      ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700" 
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    dropdown: darkMode 
      ? "bg-gray-800 border-gray-700 text-gray-200" 
      : "bg-white border-gray-300 text-gray-700",
    search: darkMode 
      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-700",
    item: darkMode 
      ? "hover:bg-gray-700" 
      : "hover:bg-gray-100",
    selected: darkMode 
      ? "bg-blue-900 text-blue-200" 
      : "bg-blue-50 text-blue-600",
    tab: darkMode 
      ? "text-gray-400 hover:text-gray-200" 
      : "text-gray-500 hover:text-gray-800",
    activeTab: darkMode 
      ? "text-blue-300 border-blue-400" 
      : "text-blue-600 border-blue-500",
  };

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Select language
  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    setSearchTerm("");
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', language.code);
    
    // Add to recent languages
    const updatedRecent = [language, ...recentLanguages.filter(lang => lang.code !== language.code)].slice(0, 5);
    setRecentLanguages(updatedRecent);
    localStorage.setItem('recentLanguages', JSON.stringify(updatedRecent.map(lang => lang.code)));
    
    // Call onChange prop
    onChange(language);
    
    // In a real app, this would change the application's language
    console.log(`Language changed to: ${language.name} (${language.code})`);
    
    // If the language is RTL, we would set the appropriate direction
    if (language.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Filter languages based on search term and selected region
  useEffect(() => {
    let filtered = languages;
    
    if (searchTerm) {
      filtered = filtered.filter(lang => 
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lang.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRegion !== "All") {
      filtered = filtered.filter(lang => lang.region === selectedRegion);
    }
    
    setFilteredLanguages(filtered);
  }, [searchTerm, selectedRegion]);

  // Load recent languages from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentLanguages');
    if (savedRecent) {
      try {
        const recentCodes = JSON.parse(savedRecent);
        const loadedRecent = recentCodes
          .map(code => languages.find(lang => lang.code === code))
          .filter(Boolean);
        setRecentLanguages(loadedRecent);
      } catch (e) {
        console.error("Error loading recent languages", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation and accessibility
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative language-selector" ref={dropdownRef}>
      {/* Language selector button */}
      <button 
        className={`flex items-center justify-between gap-2 px-4 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.button}`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {compact ? (
          <Globe size={16} />
        ) : (
          <span className="flex items-center gap-2">
            <span className="mr-1">{selectedLanguage.flag}</span>
            <span>{showLocalNames ? selectedLanguage.localName : selectedLanguage.name}</span>
          </span>
        )}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className={`absolute z-10 w-72 rounded-md shadow-lg ${themeClasses.dropdown} border ${getPositionClasses()}`}
          role="listbox"
        >
          {/* Search and options */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search languages..."
                className={`w-full pl-8 pr-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.search}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              {searchTerm && (
                <button 
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Filter options */}
            <div className="flex mt-2 text-sm">
              <button 
                className={`mr-4 pb-1 border-b-2 ${selectedRegion === "All" ? themeClasses.activeTab : themeClasses.tab}`}
                onClick={() => setSelectedRegion("All")}
              >
                All
              </button>
              <button 
                className={`mr-4 pb-1 border-b-2 ${selectedRegion === "Popular" ? themeClasses.activeTab : themeClasses.tab}`}
                onClick={() => setSelectedRegion("Popular")}
              >
                Popular
              </button>
              <button 
                className={`mr-4 pb-1 border-b-2 ${showRegions ? themeClasses.activeTab : themeClasses.tab}`}
                onClick={() => setShowRegions(!showRegions)}
              >
                Regions
              </button>
              <button 
                className={`ml-auto pb-1 ${showSettings ? themeClasses.activeTab : themeClasses.tab}`}
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
              >
                <Settings size={16} />
              </button>
            </div>
            
            {/* Region filters */}
            {showRegions && (
              <div className="flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto">
                {regions.map(region => (
                  <button
                    key={region}
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedRegion === region 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
            
            {/* Settings panel */}
            {showSettings && (
              <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm">Show native language names</label>
                  <input 
                    type="checkbox" 
                    checked={showLocalNames} 
                    onChange={() => {
                      onChange({ ...selectedLanguage, showLocalNames: !showLocalNames });
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Language preferences are saved automatically.
                </div>
              </div>
            )}
          </div>
          
          {/* Recently used languages */}
          {recentLanguages.length > 0 && !searchTerm && selectedRegion !== "Popular" && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} className="mr-1" />
                Recently Used
              </div>
              <div>
                {recentLanguages.map((language) => (
                  <button
                    key={`recent-${language.code}`}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-md ${themeClasses.item} ${
                      selectedLanguage.code === language.code ? themeClasses.selected : ""
                    }`}
                    onClick={() => selectLanguage(language)}
                    role="option"
                    aria-selected={selectedLanguage.code === language.code}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{language.flag}</span>
                      <span>{showLocalNames ? language.localName : language.name}</span>
                      {language.code !== language.name && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({language.code})
                        </span>
                      )}
                    </div>
                    {selectedLanguage.code === language.code && (
                      <Check size={16} className="text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Language list */}
          <div className="max-h-60 overflow-y-auto">
            {/* Handle "Popular" filter specially */}
            {selectedRegion === "Popular" ? (
              languages.filter(lang => lang.popular).length > 0 ? (
                languages.filter(lang => lang.popular).map((language) => (
                  <button
                    key={language.code}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left ${themeClasses.item} ${
                      selectedLanguage.code === language.code ? themeClasses.selected : ""
                    }`}
                    onClick={() => selectLanguage(language)}
                    role="option"
                    aria-selected={selectedLanguage.code === language.code}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{language.flag}</span>
                      <span>{showLocalNames ? language.localName : language.name}</span>
                      {language.rtl && (
                        <span className="ml-2 text-xs px-1 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          RTL
                        </span>
                      )}
                    </div>
                    {selectedLanguage.code === language.code && (
                      <Check size={16} className="text-blue-500" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No popular languages found
                </div>
              )
            ) : filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <button
                  key={language.code}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left ${themeClasses.item} ${
                    selectedLanguage.code === language.code ? themeClasses.selected : ""
                  }`}
                  onClick={() => selectLanguage(language)}
                  role="option"
                  aria-selected={selectedLanguage.code === language.code}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{language.flag}</span>
                    <span>{showLocalNames ? language.localName : language.name}</span>
                    {language.rtl && (
                      <span className="ml-2 text-xs px-1 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        RTL
                      </span>
                    )}
                  </div>
                  {selectedLanguage.code === language.code && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No languages found
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} available
          </div>
        </div>
      )}
    </div>
  );
}