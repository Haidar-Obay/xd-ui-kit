import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Bell,
  Volume2,
  FileText,
  Link as LinkIcon,
  Download,
  Upload,
  Trash2,
  Settings,
  RefreshCw,
} from "lucide-react";

// Create context for global toast management
const ToastContext = createContext(null);

// Toast types
const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DEFAULT: "default",
  NOTIFICATION: "notification",
  DOWNLOAD: "download",
  UPLOAD: "upload",
  DELETE: "delete",
  SYSTEM: "system",
  LOADING: "loading",
};

// Positions
const POSITIONS = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
  TOP_CENTER: "top-center",
  BOTTOM_CENTER: "bottom-center",
};

// Animation types
const ANIMATIONS = {
  FADE: "fade",
  SLIDE: "slide",
  BOUNCE: "bounce",
  FLIP: "flip",
};

// 🔥 Moved outside Toast and made it accept `position`
const getPositionClasses = (position) => {
  switch (position) {
    case POSITIONS.TOP_LEFT:
      return "top-4 left-4";
    case POSITIONS.TOP_RIGHT:
      return "top-4 right-4";
    case POSITIONS.BOTTOM_LEFT:
      return "bottom-4 left-4";
    case POSITIONS.BOTTOM_RIGHT:
      return "bottom-4 right-4";
    case POSITIONS.TOP_CENTER:
      return "top-4 left-1/2 transform -translate-x-1/2";
    case POSITIONS.BOTTOM_CENTER:
      return "bottom-4 left-1/2 transform -translate-x-1/2";
    default:
      return "top-4 right-4";
  }
};

// Toast Component
export const Toast = ({
  id,
  type = TOAST_TYPES.DEFAULT,
  title = "",
  message = "",
  description = "",
  duration = 4000,
  position = POSITIONS.TOP_RIGHT,
  showIcon = true,
  showCloseButton = true,
  onClose = () => {},
  isVisible = true,
  autoClose = true,
  pauseOnHover = true,
  progress = true,
  animationType = ANIMATIONS.FADE,
  action = null,
  actionLabel = "",
  actionCallback = () => {},
  customIcon = null,
  customClass = "",
  style = {},
  rtl = false,
  closeOnClick = false,
  role = "status",
}) => {
  const [visible, setVisible] = useState(isVisible);
  const [isPaused, setIsPaused] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  const [isActionHovered, setIsActionHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(type === TOAST_TYPES.LOADING);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const elapsedTimeRef = useRef(0);
  const remainingTimeRef = useRef(duration);
  const toastRef = useRef(null);

  const getAnimationClasses = () => {
    switch (animationType) {
      case ANIMATIONS.SLIDE:
        return "animate-slide-in";
      case ANIMATIONS.BOUNCE:
        return "animate-bounce-in";
      case ANIMATIONS.FLIP:
        return "animate-flip-in";
      case ANIMATIONS.FADE:
      default:
        return "animate-fade-in";
    }
  };

  const getIcon = () => {
    if (customIcon) return customIcon;
    if (isLoading) return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
    switch (type) {
      case TOAST_TYPES.SUCCESS: return <CheckCircle className="text-green-500" size={20} />;
      case TOAST_TYPES.ERROR: return <AlertCircle className="text-red-500" size={20} />;
      case TOAST_TYPES.WARNING: return <AlertTriangle className="text-yellow-500" size={20} />;
      case TOAST_TYPES.INFO: return <Info className="text-blue-500" size={20} />;
      case TOAST_TYPES.NOTIFICATION: return <Bell className="text-purple-500" size={20} />;
      case TOAST_TYPES.DOWNLOAD: return <Download className="text-teal-500" size={20} />;
      case TOAST_TYPES.UPLOAD: return <Upload className="text-indigo-500" size={20} />;
      case TOAST_TYPES.DELETE: return <Trash2 className="text-red-500" size={20} />;
      case TOAST_TYPES.SYSTEM: return <Settings className="text-gray-500" size={20} />;
      default: return <Volume2 className="text-gray-500" size={20} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS: return "bg-green-50 border-green-200";
      case TOAST_TYPES.ERROR: return "bg-red-50 border-red-200";
      case TOAST_TYPES.WARNING: return "bg-yellow-50 border-yellow-200";
      case TOAST_TYPES.INFO: return "bg-blue-50 border-blue-200";
      case TOAST_TYPES.NOTIFICATION: return "bg-purple-50 border-purple-200";
      case TOAST_TYPES.DOWNLOAD: return "bg-teal-50 border-teal-200";
      case TOAST_TYPES.UPLOAD: return "bg-indigo-50 border-indigo-200";
      case TOAST_TYPES.DELETE: return "bg-red-50 border-red-200";
      case TOAST_TYPES.SYSTEM: return "bg-gray-50 border-gray-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS: return "bg-green-500";
      case TOAST_TYPES.ERROR: return "bg-red-500";
      case TOAST_TYPES.WARNING: return "bg-yellow-500";
      case TOAST_TYPES.INFO: return "bg-blue-500";
      case TOAST_TYPES.NOTIFICATION: return "bg-purple-500";
      case TOAST_TYPES.DOWNLOAD: return "bg-teal-500";
      case TOAST_TYPES.UPLOAD: return "bg-indigo-500";
      case TOAST_TYPES.DELETE: return "bg-red-500";
      case TOAST_TYPES.SYSTEM: return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const handleClose = () => {
    setVisible(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => onClose(id), 300);
  };

  const startTimer = (timeRemaining) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (type === TOAST_TYPES.LOADING && autoClose === false) return;
    const startTime = Date.now();
    const interval = 10;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = timeRemaining - elapsed;
      const progressPercent = (remaining / timeRemaining) * 100;
      setProgressWidth(Math.max(0, progressPercent));
      if (remaining <= 0) handleClose();
    }, interval);
  };

  useEffect(() => {
    if (toastRef.current) toastRef.current.focus();
  }, []);

  useEffect(() => {
    if (autoClose && visible && !isPaused && duration > 0) {
      startTimeRef.current = Date.now();
      remainingTimeRef.current = duration;
      startTimer(duration);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoClose, visible, isPaused, duration]);

  useEffect(() => {
    setIsLoading(type === TOAST_TYPES.LOADING);
  }, [type]);

  if (!visible) return null;

  return (
    <div
      ref={toastRef}
      role={role}
      aria-live={type === TOAST_TYPES.ERROR ? "assertive" : "polite"}
      tabIndex={0}
      className={`fixed z-50 min-w-72 max-w-md ${getPositionClasses(position)} ${getAnimationClasses()} ${customClass}`}
      onMouseEnter={() => { if (pauseOnHover && autoClose) { setIsPaused(true); clearInterval(timerRef.current); } }}
      onMouseLeave={() => { if (pauseOnHover && autoClose) { setIsPaused(false); startTimer(remainingTimeRef.current); } }}
      onClick={() => { if (closeOnClick) handleClose(); }}
      style={{ ...style }}
    >
      <div className={`${getBgColor()} rounded-lg shadow-lg border p-4 relative overflow-hidden ${rtl ? "rtl" : ""}`}>
        <div className="flex items-start gap-3">
          {showIcon && <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>}
          <div className="flex-1">
            {title && <h4 className="font-medium text-gray-900 mb-1">{title}</h4>}
            {message && <p className="text-sm text-gray-600">{message}</p>}
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          {showCloseButton && (
            <button onClick={(e) => { e.stopPropagation(); handleClose(); }}
              aria-label="Close notification"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
        {progress && autoClose && duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
            <div className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`} style={{ width: `${progressWidth}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};

// ToastProvider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [config, setConfig] = useState({
    position: POSITIONS.TOP_RIGHT,
    maxToasts: 5,
    newestOnTop: true,
    closeOnClick: false,
    pauseOnHover: true,
    autoClose: true,
    duration: 4000,
    animation: ANIMATIONS.FADE,
  });

  const addToast = (toast) => {
    const id = toast.id || Date.now().toString();
    const newToast = { ...toast, id, position: toast.position || config.position };
    setToasts((prev) => {
      const updated = config.newestOnTop ? [newToast, ...prev] : [...prev, newToast];
      return updated.slice(0, config.maxToasts);
    });
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const groupedToasts = toasts.reduce((acc, toast) => {
    const pos = toast.position || config.position;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {});

  const toast = {
    show: (args) => addToast(args),
    success: (msg, opts = {}) => addToast({ type: TOAST_TYPES.SUCCESS, message: msg, ...opts }),
    error: (msg, opts = {}) => addToast({ type: TOAST_TYPES.ERROR, message: msg, ...opts }),
    warning: (msg, opts = {}) => addToast({ type: TOAST_TYPES.WARNING, message: msg, ...opts }),
    info: (msg, opts = {}) => addToast({ type: TOAST_TYPES.INFO, message: msg, ...opts }),
    loading: (msg, opts = {}) => {
      const id = addToast({ type: TOAST_TYPES.LOADING, message: msg, autoClose: false, ...opts });
      return {
        id,
        update: (updates) => setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t))),
        dismiss: () => removeToast(id),
      };
    },
    dismiss: removeToast,
    configure: (newConfig) => setConfig((prev) => ({ ...prev, ...newConfig })),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {Object.entries(groupedToasts).map(([position, list]) => (
        <div key={position} className={`fixed z-50 ${getPositionClasses(position)}`}>
          <div className="space-y-2">{list.map((toast) => <Toast key={toast.id} {...toast} onClose={removeToast} />)}</div>
        </div>
      ))}
    </ToastContext.Provider>
  );
};

// Export both
export { ToastContext };
