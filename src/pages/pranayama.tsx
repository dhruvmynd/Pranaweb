import { useState, useEffect } from 'react';
import { PranayamaList } from '@/components/pranayama/pranayama-list';
import { PranayamaHero } from '@/components/pranayama/pranayama-hero';
import { usePageLoading } from '@/hooks/use-page-loading';
import { EnergyParticles } from '@/components/home/energy-particles';

export function PranayamaPage() {
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);

  useEffect(() => {
    // Simulate loading time for content
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flow-bg">
      <div className="relative">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img 
            src="/breathwork.webp"
            alt="Breathwork background"
            className="w-full h-full object-cover"
            style={{ willChange: 'transform' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-white/90 to-white" />
        </div>

        {/* Ambient Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 to-transparent" />
          <EnergyParticles />
        </div>

        {/* Content */}
        <div className="relative">
          <PranayamaHero />
        </div>
      </div>
      
      <div className="relative z-10">
        <PranayamaList />
      </div>
    </div>
  );
}