import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

export function PrivacyPage() {
  return (
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FaShieldAlt className="mx-auto h-11 w-11 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
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
            <h2>Introduction</h2>
            <p>
              At Vayu, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our website and mobile application. 
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the site.
            </p>
          </section>

          <section className="mb-12">
            <h2>Information We Collect</h2>
            <h3>Personal Data</h3>
            <p>
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Register for an account</li>
              <li>Sign up for our newsletter</li>
              <li>Contact us through our contact form</li>
              <li>Use our mobile application</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name and email address</li>
              <li>Profile information</li>
              <li>Practice session data</li>
              <li>Heart rate and other biometric data (when provided)</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We automatically collect certain information when you visit, use, or navigate our platform. 
              This information does not reveal your specific identity but may include:
            </p>
            <ul>
              <li>Device and usage information</li>
              <li>IP address</li>
              <li>Browser and device characteristics</li>
              <li>Operating system</li>
              <li>Language preferences</li>
              <li>Referring URLs</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our platform</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you about updates, security alerts, and support</li>
              <li>Prevent fraud</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform and 
              hold certain information. Cookies are files with a small amount of data which may include 
              an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being 
              sent. However, if you do not accept cookies, you may not be able to use some portions of 
              our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2>Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to 
              protect the security of any personal information we process. However, despite our safeguards 
              and efforts to secure your information, no electronic transmission over the Internet or 
              information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2>Your Data Protection Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to our processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Withdraw your consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date at the top 
              of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:info@vayu-prana.com">info@vayu-prana.com</a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}