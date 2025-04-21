import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { usePageLoading } from '@/hooks/use-page-loading';
import { useState, useEffect } from 'react';

export function LeadershipPage() {
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
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Our Leadership
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the visionaries behind Prana who are dedicated to transforming human wellness through the power of breath.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Dhruv Adhia */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="/6.jpeg" 
                alt="Dhruv Adhia" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-1">Dhruv Adhia</h2>
              <p className="text-primary font-medium mb-1">Co-Founder & Chief Conscious Officer</p>
              <p className="text-sm text-muted-foreground mb-4">
                <a 
                  href="https://vimeo.com/146175321" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  International Speaker
                </a>
              </p>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Dhruv's passion lies in "Humanizing Technology." He is dedicated to merging the tangible and virtual worlds, creating seamless, intuitive experiences that prioritize natural human interactions. As an international speaker with numerous patents and international awards, he brings exceptional expertise to Prana, where he leads the development of breathing technologies that bridge the gap between ancient wisdom and modern innovation.
                </p>
                <p>
                  His goal is to contribute to the next generation of immersive breathing technologies, where human behavior is at the core of innovation, ensuring that as Prana's technology evolves, it remains deeply connected to the essence of what it means to be human.
                </p>
              </div>
              
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/dhruvadhia/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
                <a 
                  href="https://dhruvaryan.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Deepali Raiththa */}
          <motion.div
            className="bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src="/tedabout.jpg" 
                alt="Deepali Raiththa" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-1">Deepali Raiththa</h2>
              <p className="text-primary font-medium mb-2">Co-Founder & Chief Design Officer</p>
              <p className="text-sm text-muted-foreground mb-4">
                <a 
                  href="https://www.ted.com/talks/deepali_raiththa_absent_presence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  TEDx Speaker
                </a>
              </p>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Deepali leads Prana's design vision, bringing her unique artistic perspective to the intersection of ancient breathing practices and modern technology. Her approach focuses on creating intuitive, beautiful experiences that guide users through their breathing journey.
                </p>
                <p>
                  Her design philosophy embraces the fluidity and presence central to breathwork, creating experiences that guide users to be fully present in each moment. At Prana, she translates complex breathing techniques into accessible, engaging digital experiences that honor the depth of pranayama traditions.
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/deepali-raiththa-93ba5677/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
                <a 
                  href="https://deepaliraiththa.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leadership Philosophy */}
        <motion.div
          className="mt-16 max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">Our Leadership Philosophy</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              At Prana, our leadership is guided by a deep commitment to bridging ancient wisdom with modern technology. We believe that the transformative power of breath should be accessible to everyone, regardless of their background or experience level.
            </p>
            <p>
              Our team combines expertise in technology, wellness, and traditional practices to create solutions that are both scientifically validated and deeply rooted in time-tested techniques. We're dedicated to continuous research and innovation in the field of breathwork and its applications for human health and performance.
            </p>
            <p>
              We lead with integrity, transparency, and a genuine desire to improve lives through the simple yet profound practice of conscious breathing. Our vision is to create a world where everyone has the tools to harness their breath for enhanced wellbeing, performance, and consciousness.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}