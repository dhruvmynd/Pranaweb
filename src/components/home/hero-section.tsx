import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaApple, FaAndroid } from 'react-icons/fa';
import { IoWatch } from 'react-icons/io5';
import { HeroBackground } from './hero-background';
import { DeviceMockups } from './hero/device-mockups';

export function HeroSection() {
  const scrollToScience = () => {
    const scienceSection = document.getElementById('science');
    if (scienceSection) {
      scienceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      
      {/* Navigation */}
      <div className="relative z-10">
        <nav className="px-6 pt-6">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/x.png" alt="Prana" className="h-6 w-auto" />
              <span className="text-lg font-light tracking-wide">Prana</span>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex items-center min-h-[calc(100vh-5rem)]">
          <div className="max-w-7xl w-full mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              {/* Text content */}
              <div className="lg:col-span-1 text-center lg:text-left pt-20 sm:pt-0">
                <motion.h1 
                  className="text-4xl lg:text-5xl font-light tracking-wide text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Introducing{' '}
                  <span className="font-normal text-emerald-700">Vayu</span>
                </motion.h1>

                <motion.p 
                  className="mt-6 text-base text-gray-600 font-light leading-relaxed tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Experience the world's first advanced breathing companion powered by Prana Agent, your personal guide through ancient pranayama techniques. Using precise haptic vibrations on your Apple Watch and AI-driven insights, we transform traditional practices into a personalized journey of mindful breathing mastery.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <Link
                    to="/register"
                    className="rounded-full bg-emerald-700 px-8 py-2.5 text-sm font-light tracking-wide text-white hover:bg-emerald-800 text-center transition-colors sm:w-auto w-full"
                  >
                    Begin Your Journey
                  </Link>
                  <button
                    onClick={scrollToScience}
                    className="rounded-full bg-white/80 backdrop-blur-sm px-8 py-2.5 text-sm font-light tracking-wide text-gray-900 hover:bg-white/90 text-center transition-colors sm:w-auto w-full"
                  >
                    Explore the Science
                  </button>
                </motion.div>

                {/* Coming Soon Banner */}
                <motion.div
                  className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <div className="flex flex-col items-center sm:flex-row gap-4">
                    <a 
                      href="https://apps.apple.com/ca/app/vayu-by-prana/id6744126459"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full hover:bg-black/90 transition-colors whitespace-nowrap"
                    >
                      <FaApple className="h-5 w-5" />
                      <span className="font-medium">Download on App Store</span>
                    </a>
                    <Link
                      to="/app"
                      className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <span className="font-medium">Learn More</span>
                    </Link>
                    <img 
                      src="/qrcode.png"
                      alt="App Store QR Code"
                      className="mt-4 sm:mt-0 w-28 h-28 bg-white p-2 rounded-lg shadow-md border border-gray-100"
                    />
                  </div>
                </motion.div>

               <motion.div
                 className="mt-6 text-sm text-gray-600 justify-center lg:justify-start"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8, duration: 0.8 }}
               >
                 <div className="inline-flex items-center px-4 py-2 bg-gray-100/80 backdrop-blur-sm rounded-full">
                   <span className="mr-2 font-medium">Coming Fall 2025:</span>
                   <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1">
                       <FaAndroid className="h-4 w-4 text-[#3DDC84]" />
                       <span>Android</span>
                     </div>
                     <span className="text-gray-400">|</span>
                     <div className="flex items-center gap-1">
                       <IoWatch className="h-4 w-4 text-[#1428A0]" />
                       <span>Smart Watches</span>
                     </div>
                   </div>
                 </div>
               </motion.div>
              </div>

              {/* Device mockups */}
              <DeviceMockups />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}