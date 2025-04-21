import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScreenshotSectionProps {
  screenshot: {
    image: string;
    title: string;
    description: string;
    showWatchImage?: boolean;
  };
  index: number;
}

export function ScreenshotSection({ screenshot, index }: ScreenshotSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const isEven = index % 2 === 0;
  
  return (
    <div 
      ref={ref}
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          className={isEven ? "order-2 md:order-2" : "order-2 md:order-1"}
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: 'relative', zIndex: 20 }}
        >
          <h2 className="text-3xl font-light text-gray-900 mb-4">{screenshot.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{screenshot.description}</p>
          
          {index === 8 && (
            <div className="mt-8">
              <a 
                href="https://apps.apple.com/ca/app/vayu-by-prana/id6744126459"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full hover:bg-black/90 transition-colors"
              >
                <img src="/apple-xxl.png" className="h-5 w-5" alt="Apple logo" />
                <span className="font-medium">Download on App Store</span>
              </a>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className={isEven ? "order-1 md:order-1 flex justify-center" : "order-1 md:order-2 flex justify-center"}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{ position: 'relative', zIndex: 15 }}
        >
          {screenshot.showWatchImage ? (
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-[280px]">
                <div className="rounded-[2.5rem] border-[12px] border-gray-900 bg-gray-800">
                  <div className="absolute top-0 inset-x-0">
                    <div className="mx-auto h-5 w-32 rounded-b-2xl bg-gray-900"></div>
                  </div>
                  <div className="h-[500px] rounded-[1.8rem] overflow-hidden">
                    <img 
                      src={screenshot.image} 
                      alt={screenshot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Reflection effect */}
                <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent rounded-[2.5rem] blur-md transform scale-x-[0.85] scale-y-[-0.3] opacity-30"></div>
              </div>
              
              <div className="mt-8 md:mt-0">
                <div className="rounded-[2rem] border-[8px] border-gray-900 bg-gray-800">
                  <div className="h-[180px] rounded-[1.5rem] overflow-hidden bg-[#1C2127]">
                    <div className="h-full w-full flex items-center justify-center">
                      <img
                        src="/applewatch.png"
                        alt="Apple Watch"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                {/* Reflection effect for watch */}
                <div className="mt-2 h-10 bg-gradient-to-b from-black/20 to-transparent rounded-[1.5rem] blur-md transform scale-x-[0.85] scale-y-[-0.3] opacity-30"></div>
              </div>
            </div>
          ) : (
            <div className="relative w-[280px]">
              <div className="rounded-[2.5rem] border-[12px] border-gray-900 bg-gray-800">
                <div className="absolute top-0 inset-x-0">
                  <div className="mx-auto h-5 w-32 rounded-b-2xl bg-gray-900"></div>
                </div>
                <div className="h-[500px] rounded-[1.8rem] overflow-hidden">
                  <img 
                    src={screenshot.image} 
                    alt={screenshot.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Reflection effect */}
              <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-b from-black/20 to-transparent rounded-[2.5rem] blur-md transform scale-x-[0.85] scale-y-[-0.3] opacity-30"></div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}