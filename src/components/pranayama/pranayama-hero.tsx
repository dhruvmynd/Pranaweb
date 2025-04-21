import { motion } from 'framer-motion';
import { FaWind, FaHeart, FaBrain } from 'react-icons/fa';
import { IoFlash } from 'react-icons/io5';

export function PranayamaHero() {
  return (
    <div className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <FaWind className="h-11 w-11 text-primary" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Ancient Pranayama Techniques
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Discover time-tested breathing practices that have been perfected over thousands of years
            to enhance your physical, mental, and spiritual well-being.
          </p>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="relative overflow-hidden rounded-2xl border bg-primary/5 backdrop-blur-sm p-6 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <FaHeart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Heart Rate</h3>
                <p className="mt-1 text-sm text-gray-600">Optimize cardiovascular health</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-primary/5 backdrop-blur-sm p-6 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <FaBrain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mental Clarity</h3>
                <p className="mt-1 text-sm text-gray-600">Enhance cognitive function</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-primary/5 backdrop-blur-sm p-6 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <IoFlash className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Energy Flow</h3>
                <p className="mt-1 text-sm text-gray-600">Balance vital energy</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-primary/5 backdrop-blur-sm p-6 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <FaWind className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Breath Control</h3>
                <p className="mt-1 text-sm text-gray-600">Master your breathing</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}