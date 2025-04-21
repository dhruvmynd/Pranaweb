import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { subscribeToNewsletter } from '@/lib/newsletter';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !accepted) return;

    setLoading(true);
    setError(null);

    try {
      await subscribeToNewsletter(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-24 bg-gradient-to-b from-white to-primary/5">
        <motion.div 
          className="max-w-3xl mx-auto px-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm border">
            <FaCheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Thank You for Subscribing!</h3>
            <p className="text-muted-foreground">
              Welcome to our community. We'll keep you updated with the latest breathing techniques and wellness insights.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gradient-to-b from-white to-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FaEnvelope className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-light mb-4">Join Our Mindful Community</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get exclusive breathing techniques, guided practices, and wellness insights delivered to your inbox.
            Be among the first to experience our transformative approach to mindful breathing.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg max-w-xl mx-auto">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 backdrop-blur-sm"
                required
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8"
                disabled={!email || !accepted || loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2">
              <input
                type="checkbox"
                id="consent"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground">
                I agree to receive emails and accept the{' '}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="h-3 w-3 text-primary" />
              Weekly Insights
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="h-3 w-3 text-primary" />
              Exclusive Techniques
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="h-3 w-3 text-primary" />
              Early Access
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}