import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCommentAlt } from 'react-icons/fa';
import { ContactForm } from '@/components/contact/contact-form';
import { usePageLoading } from '@/hooks/use-page-loading';

export function ContactPage() {
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
    <div className="min-h-screen flow-bg pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FaCommentAlt className="mx-auto h-11 w-11 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about breathing techniques or need support? 
            We're here to help you on your journey to better breathing and wellness.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}