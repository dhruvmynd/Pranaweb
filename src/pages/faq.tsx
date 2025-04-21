import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';
import { usePageLoading } from '@/hooks/use-page-loading';
import { useEffect, useState } from 'react';

const faqs = [
  {
    question: "Do I need an Apple Watch?",
    answer: "Yes, an Apple Watch is required to get the full benefits of our app. The watch enables real-time heart rate monitoring, stress tracking, and personalized breathing guidance based on your biometric data. We use the advanced sensors in Apple Watch to provide the most accurate and effective breathing practice experience."
  },
  {
    question: "Is the app available for Android users?",
    answer: "The Android version of our app is currently in development and planned for release in Fall 2025. It will support popular Android smartwatches and provide similar features to the iOS version. Sign up for our newsletter to be notified when it becomes available."
  },
  {
    question: "What is Pranayama?",
    answer: "Pranayama is the ancient practice of breath control in yoga. It consists of various breathing techniques that help improve physical, mental, and spiritual well-being. These techniques have been perfected over thousands of years and are scientifically proven to enhance health."
  },
  {
    question: "What are the benefits of practicing breathing techniques?",
    answer: "Regular practice of breathing techniques can provide numerous benefits including: improved mental clarity, reduced stress and anxiety, enhanced cardiovascular health, better sleep quality, increased energy levels, strengthened respiratory system, and balanced emotional well-being."
  },
  {
    question: "How often should I practice?",
    answer: "For beginners, we recommend starting with 5-10 minutes daily. As you become more comfortable, you can gradually increase the duration to 15-20 minutes. Consistency is more important than duration - regular short sessions are more beneficial than irregular long ones."
  },
  {
    question: "Which technique should I start with?",
    answer: "We recommend beginning with Bhastrika (Deep breathing exercise) as it's gentle and suitable for beginners. It helps balance the body's energy and is an excellent foundation for other techniques. You can also try Anulom Vilom which is another beginner-friendly technique."
  },
  {
    question: "Can I practice if I have health conditions?",
    answer: "While breathing exercises are generally safe, it's important to consult with your healthcare provider before starting any new practice, especially if you have respiratory conditions, heart problems, or high blood pressure. Some techniques may need to be modified based on your health status."
  },
  {
    question: "How does the heart rate monitoring work?",
    answer: "Our app integrates with your Apple Watch to track your heart rate during practice sessions. This helps you monitor the effectiveness of your practice and track improvements in your cardiovascular health over time. The data is used to provide personalized recommendations and optimize your breathing patterns."
  },
  {
    question: "What is a practice streak?",
    answer: "A practice streak represents consecutive days of practice. It's a motivational feature that helps you maintain consistency. Your current streak shows your ongoing consecutive practice days, while the longest streak shows your best achievement."
  },
  {
    question: "Can I access the practices offline?",
    answer: "Currently, you need an internet connection to access the guided practices. However, once you're familiar with the techniques, you can practice them anywhere, anytime, without the app."
  }
];

export function FAQPage() {
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
          <FaQuestionCircle className="mx-auto h-11 w-11 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about pranayama practices and using the Prana app.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}