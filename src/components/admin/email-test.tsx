import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendTestEmail } from '@/lib/email';
import { FaEnvelope, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

export function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean; message?: string; error?: string} | null>(null);

  const handleTestEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await sendTestEmail();
      console.log('Test email response:', response);
      setResult(response);
    } catch (error) {
      console.error('Test email error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <FaEnvelope className="h-4 w-4" />
          <h3 className="font-medium">Email System Test</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Send a test email to verify the email delivery system is working correctly.
          The test email will be sent to hello@dhruvaryan.com.
        </p>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleTestEmail}
            disabled={loading}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <FaEnvelope className="h-3 w-3" />
            {loading ? 'Sending...' : 'Send Test Email'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {result.success ? (
                <FaCheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              ) : (
                <FaExclamationCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {result.success ? 'Success' : 'Error'}
                </p>
                <p className="text-sm mt-1">
                  {result.success ? result.message : result.error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}