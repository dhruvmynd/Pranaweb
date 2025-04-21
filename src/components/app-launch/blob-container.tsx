import { ReactNode } from 'react';
import { FluidBlob } from './fluid-blob';

interface BlobContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
  blobConfig?: {
    count?: number;
    colors?: string[][];
    sizes?: number[];
    opacities?: number[];
    speeds?: number[];
  };
}

export function BlobContainer({
  children,
  id,
  className = "",
  blobConfig = {}
}: BlobContainerProps) {
  const {
    count = 3,
    colors = [
      ['#10b981', '#0ea5e9', '#8b5cf6'],
      ['#0ea5e9', '#8b5cf6', '#ec4899'],
      ['#8b5cf6', '#ec4899', '#f59e0b'],
      ['#f59e0b', '#10b981', '#0ea5e9']
    ],
    sizes = [600, 500, 700, 550],
    opacities = [0.15, 0.1, 0.08, 0.12],
    speeds = [25, 30, 35, 28]
  } = blobConfig;

  // Generate random positions for blobs
  const generatePositions = (index: number) => {
    const positions = [
      { top: '20%', left: '15%' },
      { top: '60%', right: '10%' },
      { bottom: '15%', left: '25%' },
      { top: '30%', right: '20%' },
      { bottom: '30%', right: '30%' },
      { top: '70%', left: '10%' }
    ];
    
    return positions[index % positions.length];
  };

  return (
    <section id={id} className={`relative overflow-hidden ${className}`}>
      {/* Blob backgrounds */}
      {Array.from({ length: count }).map((_, i) => (
        <FluidBlob
          key={i}
          colors={colors[i % colors.length]}
          size={sizes[i % sizes.length]}
          opacity={opacities[i % opacities.length]}
          speed={speeds[i % speeds.length]}
          position={generatePositions(i)}
          zIndex={-10}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}