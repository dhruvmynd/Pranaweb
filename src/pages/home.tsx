import { AnimationProvider } from '@/contexts/animation-context';
import { HeroSection } from '@/components/home/hero-section';
import { WaveSection } from '@/components/home/wave-section';
import { ScienceSection } from '@/components/home/science-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { DotNavigation, homeSections } from '@/components/home/dot-navigation';
import { motion } from 'framer-motion';
import { FaBrain, FaHeart } from 'react-icons/fa';
import { GiFlowerPot, GiWindSlap } from 'react-icons/gi';
import { IoFlash } from 'react-icons/io5';
import { MdSmartphone, MdWatch } from 'react-icons/md';

export function HomePage() {
  return (
    <AnimationProvider>
      <div className="relative bg-white">
        {/* Dot Navigation */}
        <DotNavigation sections={homeSections} />
        
        {/* Sections */}
        <section id="hero">
          <HeroSection />
        </section>

        <section id="wave">
          <WaveSection />
        </section>

        <section id="science">
          <ScienceSection />
        </section>
        
        {/* Vision Section */}
        <section id="vision" className="relative min-h-[80vh] overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img 
              src="/mountain1.webp"
              alt="Mountain landscape"
              className="w-full h-full object-cover"
              loading="lazy"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white" />
          </div>

          {/* Content */}
          <div className="relative z-10 py-24">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GiFlowerPot className="h-11 w-11 text-primary mx-auto mb-6" />
                <h2 className="text-4xl font-light mb-6 text-gray-900">Our Vision for Humanity</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  In an era of rapid technological advancement and information abundance, we envision 
                  a world where ancient wisdom and modern innovation unite to unlock humanity's full potential.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-12">
                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-sm border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <IoFlash className="h-9 w-9 text-primary mb-6" />
                  <h3 className="text-xl font-medium mb-4 text-gray-900">Enhanced Performance</h3>
                  <p className="text-gray-600">
                    We empower individuals to navigate the complexities of the AI age with clarity and 
                    focus, helping them maintain peak cognitive performance while staying grounded in 
                    their inner wisdom.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-sm border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <FaHeart className="h-9 w-9 text-primary mb-6" />
                  <h3 className="text-xl font-medium mb-4 text-gray-900">Emotional Balance</h3>
                  <p className="text-gray-600">
                    Through mindful breathing practices, we help people maintain emotional equilibrium 
                    amidst the constant flow of information and technological change, fostering resilience 
                    and adaptability.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-sm border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <FaBrain className="h-9 w-9 text-primary mb-6" />
                  <h3 className="text-xl font-medium mb-4 text-gray-900">Conscious Evolution</h3>
                  <p className="text-gray-600">
                    We believe in harmonizing technological progress with human consciousness, creating 
                    a future where innovation serves to enhance our natural capabilities rather than 
                    replace them.
                  </p>
                </motion.div>
              </div>

              <motion.div 
                className="text-center mt-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                  "In the symphony of progress, let us not forget the ancient rhythm of our breath - 
                  the foundation upon which all human achievement is built."
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="newsletter">
          <NewsletterSection />
        </section>
      </div>
    </AnimationProvider>
  );
}