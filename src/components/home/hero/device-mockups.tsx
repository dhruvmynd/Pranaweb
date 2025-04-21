import { motion } from 'framer-motion';
import { ImageSlider } from './image-slider';
import { IoWatch } from 'react-icons/io5';

export function DeviceMockups() {
  return (
    <div className="relative lg:col-span-2">
      {/* iPhone Mockup with Slider */}
      <motion.div
        className="relative z-10 mx-auto w-[320px] my-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <ImageSlider />
      </motion.div>

      {/* Apple Watch Mockup */}
      <motion.div 
        className="absolute -right-12 top-1/2 w-[160px]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="rounded-[2rem] border-[8px] border-gray-900 bg-gray-800">
          <div className="h-[180px] rounded-[1.5rem] overflow-hidden bg-[#1C2127]">
            <div className="h-full w-full p-3 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-medium text-white mb-3">Breathing</div>
                <div className="w-20 h-20 rounded-full bg-gray-800 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}