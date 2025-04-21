import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FluidBlobProps {
  colors?: string[];
  size?: number;
  speed?: number;
  opacity?: number;
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  zIndex?: number;
}

export function FluidBlob({
  colors = ['#10b981', '#0ea5e9', '#8b5cf6'],
  size = 600,
  speed = 20,
  opacity = 0.15,
  position = {},
  zIndex = -10
}: FluidBlobProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState(0);

  useEffect(() => {
    // Generate random blob paths
    const generatePaths = () => {
      const newPaths: string[] = [];
      
      for (let i = 0; i < 3; i++) {
        const points = 8;
        const angle = 360 / points;
        const radius = size / 2;
        
        let path = 'M';
        
        for (let j = 0; j < points; j++) {
          const currentAngle = angle * j * (Math.PI / 180);
          const randomRadius = radius * (0.8 + Math.random() * 0.4); // 80-120% of radius
          const x = Math.cos(currentAngle) * randomRadius;
          const y = Math.sin(currentAngle) * randomRadius;
          
          if (j === 0) {
            path += `${x},${y}`;
          } else {
            const prevAngle = angle * (j - 1) * (Math.PI / 180);
            const prevX = Math.cos(prevAngle) * radius;
            const prevY = Math.sin(prevAngle) * radius;
            
            // Control points for bezier curve
            const cp1x = prevX + (x - prevX) * 0.5 + Math.random() * 50 - 25;
            const cp1y = prevY + (y - prevY) * 0.5 + Math.random() * 50 - 25;
            const cp2x = x - (x - prevX) * 0.5 + Math.random() * 50 - 25;
            const cp2y = y - (y - prevY) * 0.5 + Math.random() * 50 - 25;
            
            path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
          }
        }
        
        // Close the path
        path += ' Z';
        newPaths.push(path);
      }
      
      return newPaths;
    };
    
    setPaths(generatePaths());
    
    // Animate between paths
    const interval = setInterval(() => {
      setCurrentPath((prev) => (prev + 1) % 3);
    }, speed * 1000);
    
    return () => clearInterval(interval);
  }, [size, speed]);

  if (paths.length === 0) return null;

  return (
    <div 
      className="absolute pointer-events-none" 
      style={{ 
        top: position.top, 
        left: position.left, 
        right: position.right, 
        bottom: position.bottom,
        zIndex
      }}
    >
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`${-size/2} ${-size/2} ${size} ${size}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {colors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
          
          <motion.path
            d={paths[currentPath]}
            fill={`url(#gradient-${size})`}
            opacity={opacity}
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 0.9],
              rotate: [0, 10, -5, 0],
            }}
            transition={{
              duration: speed,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}