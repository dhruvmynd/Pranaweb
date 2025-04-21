import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown, Download, Apple, Vibrate, Watch } from 'lucide-react';
import { BlobContainer } from '@/components/app-launch/blob-container';
import { ScreenshotSection } from '@/components/app-launch/screenshot-section';
import { DotNavigation, Section } from '@/components/home/dot-navigation';
import { Button } from '@/components/ui/button';

// Define sections for dot navigation
const appSections: Section[] = [
  { id: 'hero', label: 'Welcome' },
  { id: 'features1', label: 'Breathing' },
  { id: 'features2', label: 'Sessions' },
  { id: 'features3', label: 'Heart Rate' },
  { id: 'features4', label: 'Analytics' },
  { id: 'features5', label: 'Self Reflection' },
  { id: 'features6', label: 'Mood' },
  { id: 'features7', label: 'Journal' },
  { id: 'features8', label: 'Assistant' },
  { id: 'features9', label: 'Watch' },
  { id: 'features10', label: 'Community' }
];

// App screenshots with descriptions
const appScreenshots = [
  {
    image: '/1.webp', 
    title: 'Breathing Techniques',
    description: 'Discover the ancient wisdom of pranayama reimagined for modern life. Vayu guides you through time-tested techniques with precision and care, using a combination of haptic feedback and visual cues that respond to your unique breathing patterns. Each inhale and exhale becomes a mindful journey toward balance.'
  },
  {
    image: '/2.webp',
    title: 'Guided Breathing Sessions',
    description: 'Immerse yourself in expertly crafted sessions designed by pranayama masters. Each session adapts to your energy level and goals—whether you need to energize for the day ahead, find focus during work, or prepare for restful sleep. The haptic guidance creates a seamless experience where technology fades away and pure breath remains.'
  },
  {
    image: '/3.webp',
    title: 'Heart Rate Monitoring',
    description: 'Witness the science of breath in action as you observe your heart rate respond in real-time. The app visualizes the immediate calming effect of proper breathing on your cardiovascular system, showing how specific techniques can lower heart rate by up to 15 BPM in just minutes—a powerful demonstration of mind-body connection.'
  },
  {
    image: '/4.webp',
    title: 'Real Time Analytics',
    description: 'Transform your breathing journey with sophisticated biometric analysis that reveals patterns invisible to the naked eye. Watch as your Heart Rate Variability (HRV) improves over weeks of practice—a key indicator of stress resilience and autonomic nervous system health. The app translates complex physiological data into intuitive insights that guide your growth.'
  },
  {
    image: '/5.webp',
    title: 'Self Reflection',
    description: 'Become your own breathing architect with our customizable practice builder. Fine-tune each phase of your breathing cycle—from the length of inhales and exhales to the duration of holds—creating a personalized practice that evolves with your expertise. Save your custom sequences and track how they affect your metrics differently.'
  },
  {
    image: '/6.webp',
    title: 'Mood Tracking',
    description: 'Develop emotional intelligence through our nuanced mood tracking system. Rather than simplistic "good" or "bad" states, Vayu recognizes five distinct mind-states from ancient wisdom traditions: scattered, sluggish, wavering, focused, and still. Watch as your emotional landscape transforms, with most users reporting a 40% increase in "still" and "focused" states after just 30 days.'
  },
  {
    image: '/7.webp',
    title: 'Journal your thoughts',
    description: 'Capture the subtle shifts in your consciousness through our intelligent journaling system. The Vayu assistant analyzes linguistic patterns in your entries to identify emotional trends, cognitive clarity, and stress indicators. This creates a feedback loop between your subjective experience and objective measurements, revealing connections between your breathing practice and mental state that might otherwise remain hidden.'
  },
  {
    image: '/8.webp',
    title: 'Vayu Assistant',
    description: 'Meet your personal pranayama guide—an AI assistant trained on thousands of years of breathing wisdom and modern respiratory science. Unlike generic AI, Vayu Assistant understands your unique practice history, physiological patterns, and preferences. Ask questions about technique refinement, troubleshoot challenges, or explore the philosophy behind specific practices—all with the context of your personal journey.'
  },
  {
    image: '/10.webp',
    title: 'Apple Watch Integration',
    description: 'Experience the revolutionary haptic guidance system that transforms your Apple Watch into a silent breathing coach. Our proprietary vibration patterns create a subtle "language" that your nervous system quickly learns to interpret—guiding you through complex breathing patterns without requiring visual attention. This allows for truly eyes-closed practice while maintaining perfect rhythm and technique.',
    showWatchImage: true
  },
  {
    image: '/9.webp',
    title: 'Join Our Community',
    description: 'Become part of a global movement of conscious breathers sharing insights and supporting each others growth. Our community features include practice circles, achievement sharing, and expert-led discussions. Members report that community accountability increases practice consistency by 78%, while the collective wisdom accelerates learning and deepens understanding of subtle breathing mechanics.'
  }
];

export function AppLaunchPage() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const { scrollY } = useScroll();
  
  // Background animation values
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -300]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale1 = useTransform(scrollY, [0, 500], [1, 1.2]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-white to-blue-50/20"></div>
        
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-200/20 to-emerald-300/10 blur-3xl"
          style={{ y: y1, scale: scale1, opacity: opacity1 }}
        />
        <motion.div 
          className="absolute top-[30%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200/10 to-emerald-200/10 blur-3xl"
          style={{ y: y2 }}
        />
        <motion.div 
          className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-200/10 to-blue-200/10 blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        {/* Subtle particle effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400/10"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                delay: Math.random() * 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      {/* Dot Navigation */}
      <DotNavigation sections={appSections} />
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
        {/* Hero-specific background elements */}
        <div className="absolute inset-0 -z-5">
          <motion.div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-400/5 to-blue-300/5 blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-6">
            Introducing <span className="bg-emerald-100 text-emerald-700 font-normal px-4 py-1 rounded-2xl">Vayu</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The world's first advanced breathing companion powered by Prana Agent, using haptic vibrations to guide you through ancient pranayama techniques.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
              <Vibrate className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-700">Haptic Guidance</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
              <Watch className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-700">Apple Watch Integration</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center mb-8">
            <a
              href="https://apps.apple.com/ca/app/vayu-by-prana/id6744126459"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-3 py-1 h-10 rounded-full hover:bg-black/90 transition-colors z-30"
            >
              <img src="/apple-xxl.png" className="h-5 w-5" />
              <span className="font-medium">Download on App Store</span>
            </a>
        
            <img
              src="/qrcode.png"
              alt="App Store QR Code"
              className="w-24 h-24 bg-white p-1 rounded-lg shadow-md border border-gray-100"
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: showScrollIndicator ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <p className="text-gray-500 mb-2">Scroll to explore</p>
            <ArrowDown className="h-5 w-5 text-gray-400" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* App Screenshots Sections */}
      <div className="relative">
        <BlobContainer 
          id="features1"
          blobConfig={{
            count: 2,
            colors: [
              ['#10b981', '#0ea5e9'],
              ['#0ea5e9', '#10b981']
            ],
            opacities: [0.08, 0.06]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[0]} index={0} />
        </BlobContainer>
        
        <BlobContainer 
          id="features2"
          blobConfig={{
            count: 2,
            colors: [
              ['#0ea5e9', '#8b5cf6'],
              ['#8b5cf6', '#0ea5e9']
            ],
            opacities: [0.07, 0.05]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[1]} index={1} />
        </BlobContainer>
        
        <BlobContainer 
          id="features3"
          blobConfig={{
            count: 2,
            colors: [
              ['#ef4444', '#f97316'],
              ['#f97316', '#ef4444']
            ],
            opacities: [0.06, 0.04]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[2]} index={2} />
        </BlobContainer>
        
        <BlobContainer 
          id="features4"
          blobConfig={{
            count: 2,
            colors: [
              ['#8b5cf6', '#ec4899'],
              ['#ec4899', '#8b5cf6']
            ],
            opacities: [0.07, 0.05]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[3]} index={3} />
        </BlobContainer>
        
        <BlobContainer 
          id="features5"
          blobConfig={{
            count: 2,
            colors: [
              ['#10b981', '#14b8a6'],
              ['#14b8a6', '#10b981']
            ],
            opacities: [0.08, 0.06]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[4]} index={4} />
        </BlobContainer>
      </div>
      
      <section id="haptics" className="py-20 px-4 relative">
        {/* Haptics section background */}
        <div className="absolute inset-0 -z-5 bg-gradient-to-b from-white/80 via-emerald-50/80 to-white/80"></div>
        <div className="absolute inset-0 -z-4">
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-300/10 to-emerald-100/5 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* Vibration wave patterns */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-emerald-200/30 rounded-full"
              style={{
                width: 300 + i * 100,
                height: 300 + i * 100,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Vibrate className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-3xl font-light text-gray-900 mb-4">Advanced Vibrational Guidance</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Vayu's revolutionary haptic system creates a direct conversation with your nervous system through precisely calibrated vibration patterns. Unlike simple timers, our technology uses variable intensity, rhythm, and duration to communicate the full complexity of pranayama cycles—creating an intuitive experience that becomes second nature after just a few sessions.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium text-emerald-700 mb-2">Customizable Intensity</h3>
                <p className="text-gray-600">Fine-tune vibration parameters to your unique sensory threshold. Our adaptive system learns your preferences over time, automatically adjusting to environmental conditions and your changing sensitivity levels throughout the day.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium text-emerald-700 mb-2">Technique-Specific Patterns</h3>
                <p className="text-gray-600">Experience distinct vibration "languages" for each pranayama technique. Bhastrika features sharp, energizing pulses while Anulom Vilom uses alternating left-right patterns that mirror the nostril activation sequence.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium text-emerald-700 mb-2">Subtle Reminders</h3>
                <p className="text-gray-600">Our biofeedback system detects when your breathing pattern deviates from the optimal rhythm and provides gentle corrective cues. This creates a continuous feedback loop that helps develop proper technique even during eyes-closed practice.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      <div className="relative">
        <BlobContainer 
          id="features6"
          blobConfig={{
            count: 2,
            colors: [
              ['#f59e0b', '#d97706'],
              ['#d97706', '#f59e0b']
            ],
            opacities: [0.07, 0.05]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[5]} index={5} />
        </BlobContainer>
        
        <BlobContainer 
          id="features7"
          blobConfig={{
            count: 2,
            colors: [
              ['#6366f1', '#8b5cf6'],
              ['#8b5cf6', '#6366f1']
            ],
            opacities: [0.06, 0.04]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[6]} index={6} />
        </BlobContainer>
        
        <BlobContainer 
          id="features8"
          blobConfig={{
            count: 2,
            colors: [
              ['#0ea5e9', '#06b6d4'],
              ['#06b6d4', '#0ea5e9']
            ],
            opacities: [0.07, 0.05]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[7]} index={7} />
        </BlobContainer>
        
        <BlobContainer 
          id="features9"
          blobConfig={{
            count: 2,
            colors: [
              ['#10b981', '#059669'],
              ['#059669', '#10b981']
            ],
            opacities: [0.08, 0.06]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[8]} index={8} />
        </BlobContainer>
        
        <BlobContainer 
          id="features10"
          blobConfig={{
            count: 2,
            colors: [
              ['#8b5cf6', '#6366f1'],
              ['#6366f1', '#8b5cf6']
            ],
            opacities: [0.07, 0.05]
          }}
        >
          <ScreenshotSection screenshot={appScreenshots[9]} index={9} />
        </BlobContainer>
      </div>
      
      {/* Final CTA Section */}
      <section className="py-20 px-4 relative">
        {/* CTA background */}
        <div className="absolute inset-0 -z-5 bg-gradient-to-b from-white via-blue-50/30 to-emerald-50/30"></div>
        <div className="absolute inset-0 -z-4 overflow-hidden">
          <motion.div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-t from-emerald-200/10 to-transparent blur-3xl"
            animate={{ 
              y: [50, 0, 50],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* Floating particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400/20"
              style={{
                width: Math.random() * 8 + 4,
                height: Math.random() * 8 + 4,
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 30}%`,
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-light text-gray-900 mb-4">Ready to Transform Your Breathing Practice?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of practitioners who have discovered the profound difference that precision-guided breathing makes. Our users report 43% deeper relaxation, 37% improved focus, and 28% better sleep quality within just 21 days of consistent practice. Experience the difference that centuries of wisdom combined with cutting-edge technology can make in your daily life.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://apps.apple.com/ca/app/vayu-by-prana/id6744126459"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-full hover:bg-black/90 transition-colors whitespace-nowrap z-30"
              >
                <img src="/apple-xxl.png" className="h-5 w-5" />
                <span className="font-medium">Download on App Store</span>
              </a>
              
              <img 
                src="/qrcode.png"
                alt="App Store QR Code"
                className="w-32 h-32 bg-white p-2 rounded-lg shadow-md border border-gray-100"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}