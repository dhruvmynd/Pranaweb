import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendBlogNotification } from '@/lib/blog/notifications';

interface NotificationStatusProps {
  postId: string;
  published: boolean;
}

export function NotificationStatus({ postId, published }: NotificationStatusProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!published) {
    return null;
  }

  const handleSendNotification = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await sendBlogNotification(postId);
      if (result.success) {
        setMessage(result.message);
        setSent(true);
      } else {
        throw new Error(result.error || 'Failed to send notification');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send notification');
      console.error('Send notification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium mb-2">Email Notification</h4>

      {error && (
        <div className="text-sm text-red-600 mb-2 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 text-sm text-green-600 mb-2 bg-green-50 p-2 rounded">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      )}

      <Button
        size="sm"
        onClick={handleSendNotification}
        disabled={loading}
        variant={sent ? "outline" : "default"}
        className="flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        {loading ? 'Sending...' : sent ? 'Resend Notification' : 'Send Notification'}
      </Button>
    </div>
  );
}