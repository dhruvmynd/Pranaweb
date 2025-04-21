import { motion } from 'framer-motion';
import { FaScroll } from 'react-icons/fa';

export function TermsPage() {
  return (
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FaScroll className="mx-auto h-11 w-11 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>

        <motion.div
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <section className="mb-12">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using Vayu's website and mobile application (the "Service"), you agree 
              to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
              you may not access the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2>2. Apple Watch Requirement</h2>
            <p>
              The Service requires an Apple Watch to access its full functionality. By using the Service, 
              you acknowledge that:
            </p>
            <ul>
              <li>An Apple Watch is required for heart rate monitoring and other biometric features</li>
              <li>Certain features may be limited or unavailable without an Apple Watch</li>
              <li>The Service is optimized for use with Apple Watch Series 4 and newer</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current 
              information. Failure to do so constitutes a breach of the Terms, which may result in 
              immediate termination of your account.
            </p>
            <p>
              You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Vayu and 
              are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2>5. Health Disclaimer</h2>
            <p>
              The Service provides breathing exercises and wellness guidance. However:
            </p>
            <ul>
              <li>It is not a substitute for professional medical advice</li>
              <li>Consult your healthcare provider before starting any new exercise program</li>
              <li>We are not responsible for any health problems that may result from practice sessions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>6. User Data</h2>
            <p>
              We collect and process your data in accordance with our Privacy Policy. By using the Service, 
              you agree to:
            </p>
            <ul>
              <li>The collection of biometric data through Apple Watch</li>
              <li>Storage and analysis of your practice session data</li>
              <li>Receiving notifications and updates about your practice</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>7. Subscription Terms</h2>
            <p>
              Some features of the Service require a paid subscription. By purchasing a subscription:
            </p>
            <ul>
              <li>You agree to pay all fees in accordance with the billing terms</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Refunds are provided in accordance with the platform's refund policy</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Vayu, nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses.
            </p>
          </section>

          <section className="mb-12">
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is 
              material, we will try to provide at least 30 days' notice prior to any new terms taking 
              effect.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:legal@vayu-prana.com">legal@vayu-prana.com</a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}