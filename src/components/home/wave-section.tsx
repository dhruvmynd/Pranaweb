import { motion } from 'framer-motion';
import { WaveAnimation } from './wave-animation';

export function WaveSection() {
  return (
    <section className="relative min-h-[500px] overflow-hidden">
      {/* Wave Animation Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20">
        <WaveAnimation />
      </div>
      
      {/* Radial blur overlay */}
      <div className="absolute inset-0">
        {/* Center strong blur */}
        <div className="absolute inset-0 backdrop-blur-sm opacity-80 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/50 to-transparent" />
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent" />
        
        {/* Left fade */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent" />
        
        {/* Right fade */}
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent" />
        
        {/* Radial gradient overlay for smooth transitions */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/10 to-white/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center py-16">
        <div className="max-w-7xl w-full mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-h2 mb-8 bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent font-light">
              Experience the Power of Vibrational Harmony
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed font-light">
              Our unique approach combines ancient wisdom with cutting-edge technology,
              using precise vibrations and sound frequencies to guide your breath into
              perfect harmony with your body's natural rhythms.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}