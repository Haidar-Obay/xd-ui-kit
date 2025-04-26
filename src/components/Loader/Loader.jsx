import { useState, useEffect, useRef } from "react";

// Enhanced loader with beautiful design and inventory management specialization
export const Loader = ({
  color = "#4f46e5", // Default indigo
  accentColor,
  size = "md",
  type = "pulse",
  theme = "light",
  preset = "default", // 'default', 'inventory', 'shipping', 'analytics'
  label = "",
  progress = null,
  showControls = false,
}) => {
  // Create refs for animations
  const animationRef = useRef(null);
  const containerRef = useRef(null);

  // Set up state
  const [currentType, setCurrentType] = useState(
    preset === "inventory" ? "inventory" : type
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Setup theme colors
  const getThemeColors = () => {
    // If preset is specified, use those colors
    if (preset === "inventory") {
      return {
        primary: "#0891b2", // Cyan
        accent: "#06b6d4",
        background: theme === "dark" ? "#0f172a" : "#f8fafc",
        text: theme === "dark" ? "#f1f5f9" : "#1e293b",
      };
    } else if (preset === "shipping") {
      return {
        primary: "#16a34a", // Green
        accent: "#22c55e",
        background: theme === "dark" ? "#0f172a" : "#f8fafc",
        text: theme === "dark" ? "#f1f5f9" : "#1e293b",
      };
    } else if (preset === "analytics") {
      return {
        primary: "#8b5cf6", // Purple
        accent: "#a78bfa",
        background: theme === "dark" ? "#0f172a" : "#f8fafc",
        text: theme === "dark" ? "#f1f5f9" : "#1e293b",
      };
    } else {
      // User-specified colors
      return {
        primary: color,
        accent: accentColor || adjustColorBrightness(color, 20),
        background: theme === "dark" ? "#0f172a" : "#f8fafc",
        text: theme === "dark" ? "#f1f5f9" : "#1e293b",
      };
    }
  };

  // Utility to adjust color brightness
  const adjustColorBrightness = (hex, percent) => {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness
    r = Math.min(255, Math.max(0, r + (r * percent) / 100));
    g = Math.min(255, Math.max(0, g + (g * percent) / 100));
    b = Math.min(255, Math.max(0, b + (b * percent) / 100));

    // Convert back to hex
    return (
      "#" +
      Math.round(r).toString(16).padStart(2, "0") +
      Math.round(g).toString(16).padStart(2, "0") +
      Math.round(b).toString(16).padStart(2, "0")
    );
  };

  // Size mapping with refined proportions
  const sizeMap = {
    xs: {
      container: "h-10 w-10",
      item: "h-2 w-2",
      text: "text-xs",
      gap: "gap-1",
    },
    sm: {
      container: "h-16 w-16",
      item: "h-3 w-3",
      text: "text-sm",
      gap: "gap-1",
    },
    md: {
      container: "h-20 w-20",
      item: "h-4 w-4",
      text: "text-base",
      gap: "gap-2",
    },
    lg: {
      container: "h-28 w-28",
      item: "h-6 w-6",
      text: "text-lg",
      gap: "gap-2",
    },
    xl: {
      container: "h-36 w-36",
      item: "h-8 w-8",
      text: "text-xl",
      gap: "gap-3",
    },
  };

  // Handle animation
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setRotation((prev) => (prev + 1) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Color theme
  const colors = getThemeColors();

  // Base styling
  const baseContainerStyle = {
    backgroundColor:
      theme === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.8)",
    boxShadow:
      theme === "dark"
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "0.75rem", // Rounded corners
    padding: "1.5rem",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
  };

  // Enhanced Pulse loader
  const PulseLoader = () => {
    const innerCircleSize =
      parseInt(sizeMap[size].container.split("-")[1]) * 0.6;

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ filter: "drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07))" }}
      >
        {/* Outer ring */}
        <div
          className="absolute rounded-full animate-ping"
          style={{
            width: parseInt(sizeMap[size].container.split("-")[1]) + "px",
            height: parseInt(sizeMap[size].container.split("-")[1]) + "px",
            backgroundColor: "transparent",
            border: `2px solid ${colors.primary}`,
            opacity: 0.3,
            animationDuration: "1.5s",
          }}
        />

        {/* Middle ring */}
        <div
          className="absolute rounded-full animate-ping"
          style={{
            width: parseInt(sizeMap[size].container.split("-")[1]) * 0.8 + "px",
            height:
              parseInt(sizeMap[size].container.split("-")[1]) * 0.8 + "px",
            backgroundColor: "transparent",
            border: `2px solid ${colors.accent}`,
            opacity: 0.5,
            animationDuration: "1.8s",
            animationDelay: "0.3s",
          }}
        />

        {/* Inner circle */}
        <div
          className="rounded-full"
          style={{
            width: innerCircleSize + "px",
            height: innerCircleSize + "px",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            boxShadow: `0 0 15px rgba(${parseInt(
              colors.primary.slice(1, 3),
              16
            )}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(
              colors.primary.slice(5, 7),
              16
            )}, 0.5)`,
          }}
        />
      </div>
    );
  };

  // Orbital loader with smooth movement
  const OrbitalLoader = () => {
    const baseSize = parseInt(sizeMap[size].container.split("-")[1]);
    const orbitSize = baseSize;
    const planetSize = baseSize * 0.18;
    const moonSize = baseSize * 0.08;

    return (
      <div
        className="relative"
        style={{ width: `${orbitSize}px`, height: `${orbitSize}px` }}
      >
        {/* Main orbit path */}
        <div
          className="absolute rounded-full"
          style={{
            width: "100%",
            height: "100%",
            border: `1px solid ${
              theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
            }`,
            top: "0",
            left: "0",
          }}
        />

        {/* Center "sun" */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${planetSize * 1.5}px`,
            height: `${planetSize * 1.5}px`,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 10px ${colors.primary}`,
          }}
        />

        {/* Orbiting planet 1 */}
        <div
          className="absolute"
          style={{
            width: `${planetSize}px`,
            height: `${planetSize}px`,
            top: "50%",
            left: "50%",
            transform: `rotate(${rotation}deg) translateX(${
              orbitSize / 2 - planetSize / 2
            }px) rotate(-${rotation}deg)`,
            transformOrigin: "0 0",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.accent,
              boxShadow: `0 0 5px ${colors.accent}`,
            }}
          />
        </div>

        {/* Orbiting planet 2 */}
        <div
          className="absolute"
          style={{
            width: `${planetSize}px`,
            height: `${planetSize}px`,
            top: "50%",
            left: "50%",
            transform: `rotate(${rotation * 0.6 + 120}deg) translateX(${
              orbitSize / 2 - planetSize / 2
            }px) rotate(-${rotation * 0.6 + 120}deg)`,
            transformOrigin: "0 0",
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.primary,
              boxShadow: `0 0 5px ${colors.primary}`,
            }}
          />

          {/* Moon */}
          <div
            className="absolute rounded-full"
            style={{
              width: `${moonSize}px`,
              height: `${moonSize}px`,
              backgroundColor: colors.accent,
              top: "-25%",
              left: "75%",
              boxShadow: `0 0 3px ${colors.accent}`,
            }}
          />
        </div>
      </div>
    );
  };

  // Elegant Dots loader
  const DotsLoader = () => {
    const dotSize = parseInt(sizeMap[size].item.split("-")[1]);
    const containerSize = parseInt(sizeMap[size].container.split("-")[1]);

    return (
      <div
        className="relative"
        style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const delay = i * 0.15;
          const angle = (rotation + i * 72) % 360;
          const distance = containerSize * 0.35;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;

          return (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                background: i % 2 === 0 ? colors.primary : colors.accent,
                left: `${containerSize / 2 + x - dotSize / 2}px`,
                top: `${containerSize / 2 + y - dotSize / 2}px`,
                animationDelay: `${delay}s`,
                boxShadow: `0 0 5px ${
                  i % 2 === 0 ? colors.primary : colors.accent
                }`,
              }}
            />
          );
        })}
      </div>
    );
  };

  // Spinning Gradient loader
  const SpinningGradientLoader = () => {
    const computedSize = parseInt(
      sizeMap[size === "xs" ? "sm" : size].container.split("-")[1]
    ); // ✅ renamed
    const innerSize = computedSize * 0.8;

    return (
      <div
        className="relative"
        style={{ width: `${computedSize}px`, height: `${computedSize}px` }}
      >
        {/* Outer spinning gradient ring */}
        <div
          className="absolute rounded-full"
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `conic-gradient(${colors.primary}, ${colors.accent}, ${colors.primary})`,
            transform: `rotate(${rotation}deg)`,
            opacity: 0.8,
          }}
        />

        {/* Inner circle (hole) */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            backgroundColor: theme === "dark" ? "#0f172a" : "#f8fafc",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    );
  };

  // Inventory Management Specialized Loader
  const InventoryLoader = () => {
    const baseSize = parseInt(sizeMap[size].container.split("-")[1]);
    const boxSize = baseSize * 0.25;
    const positions = [
      { x: baseSize / 2 - boxSize / 2, y: baseSize * 0.1 }, // Top
      { x: baseSize * 0.1, y: baseSize / 2 - boxSize / 2 }, // Left
      { x: baseSize * 0.9 - boxSize, y: baseSize / 2 - boxSize / 2 }, // Right
      { x: baseSize / 2 - boxSize / 2, y: baseSize * 0.9 - boxSize }, // Bottom
    ];

    // Calculate position for moving box based on rotation
    const movePosition = () => {
      // Divide rotation into 4 quarters to determine which path the box is on
      const normalizedRotation = rotation % 360;
      const segment = Math.floor(normalizedRotation / 90);
      const segmentProgress = (normalizedRotation % 90) / 90;

      // Calculate positions based on current segment
      let startPos, endPos;

      switch (segment) {
        case 0: // Top to right
          startPos = positions[0];
          endPos = positions[2];
          break;
        case 1: // Right to bottom
          startPos = positions[2];
          endPos = positions[3];
          break;
        case 2: // Bottom to left
          startPos = positions[3];
          endPos = positions[1];
          break;
        case 3: // Left to top
          startPos = positions[1];
          endPos = positions[0];
          break;
      }

      // Interpolate position
      return {
        x: startPos.x + (endPos.x - startPos.x) * segmentProgress,
        y: startPos.y + (endPos.y - startPos.y) * segmentProgress,
      };
    };

    const movingBoxPos = movePosition();

    return (
      <div
        className="relative"
        style={{ width: `${baseSize}px`, height: `${baseSize}px` }}
      >
        {/* Draw connections between boxes */}
        <svg
          width={baseSize}
          height={baseSize}
          className="absolute top-0 left-0"
        >
          <path
            d={`M ${positions[0].x + boxSize / 2} ${
              positions[0].y + boxSize / 2
            } 
               L ${positions[2].x + boxSize / 2} ${
              positions[2].y + boxSize / 2
            } 
               L ${positions[3].x + boxSize / 2} ${
              positions[3].y + boxSize / 2
            } 
               L ${positions[1].x + boxSize / 2} ${
              positions[1].y + boxSize / 2
            } 
               L ${positions[0].x + boxSize / 2} ${
              positions[0].y + boxSize / 2
            }`}
            stroke={
              theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"
            }
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Stationary boxes */}
        {positions.map((pos, i) => (
          <div
            key={i}
            className="absolute rounded shadow-md"
            style={{
              width: `${boxSize}px`,
              height: `${boxSize}px`,
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              backgroundColor: theme === "dark" ? "#1e293b" : "#e2e8f0",
              border: `1px solid ${colors.primary}`,
              zIndex: 1,
            }}
          >
            {/* Small icon inside box */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="rounded-sm"
                style={{
                  width: "60%",
                  height: "60%",
                  backgroundColor: colors.primary,
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        ))}

        {/* Moving box */}
        <div
          className="absolute rounded shadow-lg"
          style={{
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            left: `${movingBoxPos.x}px`,
            top: `${movingBoxPos.y}px`,
            backgroundColor: colors.accent,
            border: `1px solid ${colors.primary}`,
            transition: "left 0.1s linear, top 0.1s linear",
            zIndex: 2,
            boxShadow: `0 0 8px ${colors.accent}`,
          }}
        />

        {/* Progress indicator (if applicable) */}
        {progress !== null && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: colors.primary,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Render the loader based on type
  const renderLoader = () => {
    switch (currentType) {
      case "pulse":
        return <PulseLoader />;
      case "orbital":
        return <OrbitalLoader />;
      case "dots":
        return <DotsLoader />;
      case "spinning":
        return <SpinningGradientLoader />;
      case "inventory":
        return <InventoryLoader />;
      default:
        return <PulseLoader />;
    }
  };

  // Toggle through available loaders
  const toggleLoader = () => {
    const types = ["pulse", "orbital", "dots", "spinning", "inventory"];
    const currentIndex = types.indexOf(currentType);
    const nextIndex = (currentIndex + 1) % types.length;
    setCurrentType(types[nextIndex]);
  };

  // Toggle animation
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center"
      style={baseContainerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-center justify-center">
        {renderLoader()}

        {label && (
          <div
            className={`mt-6 font-medium ${sizeMap[size].text}`}
            style={{ color: colors.text }}
          >
            {label}
            {progress !== null && ` (${progress}%)`}
          </div>
        )}
      </div>

      {showControls && (
        <div className="flex mt-6 space-x-3">
          <button
            onClick={toggleLoader}
            className="px-4 py-2 rounded-md text-white text-sm font-medium transition-all"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
              boxShadow: `0 2px 5px rgba(${parseInt(
                colors.primary.slice(1, 3),
                16
              )}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(
                colors.primary.slice(5, 7),
                16
              )}, 0.3)`,
              transform: hovered ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            Change Style
          </button>

          <button
            onClick={toggleAnimation}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              border: `1px solid ${colors.primary}`,
              color: colors.primary,
              transform: hovered ? "translateY(-1px)" : "translateY(0)",
            }}
          >
            {isAnimating ? "Pause" : "Resume"}
          </button>
        </div>
      )}
    </div>
  );
};
