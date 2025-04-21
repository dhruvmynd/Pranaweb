import { supabase } from '../supabase';
import { formatImageUrl } from '../blog';

interface NotificationResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    sentCount: number;
    failedCount: number;
  };
}

export async function sendBlogNotification(postId: string): Promise<NotificationResult> {
  try {
    // Get the blog post details
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (postError) throw postError;
    if (!post) throw new Error('Blog post not found');

    // Ensure thumbnail URL is correctly formatted
    const formattedThumbnailUrl = formatImageUrl(post.thumbnail_url);

    // Get active subscribers
    const { data: subscribers, error: subscriberError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'active')
      .eq('gdpr_consent', true);

    if (subscriberError) throw subscriberError;
    if (!subscribers?.length) {
      throw new Error('No active subscribers found');
    }

    // Send emails in batches
    const batchSize = 50;
    let successCount = 0;
    let failedEmails: string[] = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      try {
        // Send each email individually to protect subscriber privacy
        for (const subscriber of batch) {
          const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'api-key': import.meta.env.VITE_BREVO_API_KEY,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              sender: {
                name: 'Vayu',
                email: 'info@vayu-prana.com'
              },
              to: [{
                email: subscriber.email
              }],
              subject: `New Post: ${post.title}`,
              htmlContent: createEmailTemplate(
                post.title, 
                post.excerpt, 
                post.slug,
                formattedThumbnailUrl,
                subscriber.email
              ),
              tags: ['blog-notification']
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Email send error:', errorData);
            failedEmails.push(subscriber.email);
          } else {
            successCount++;
          }

          // Small delay between emails to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Batch error:', error);
        batch.forEach(subscriber => failedEmails.push(subscriber.email));
      }
    }

    if (successCount === 0) {
      throw new Error('Failed to send any emails successfully');
    }

    return {
      success: true,
      message: `Successfully sent ${successCount} emails${
        failedEmails.length > 0 ? `, ${failedEmails.length} failed` : ''
      }`,
      data: {
        sentCount: successCount,
        failedCount: failedEmails.length
      }
    };

  } catch (error) {
    console.error('Send notification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send notification'
    };
  }
}

function createEmailTemplate(
  title: string, 
  excerpt: string, 
  slug: string, 
  thumbnailUrl: string,
  email: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Inter, system-ui, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: white; border-radius: 8px; padding: 32px; margin: 20px 0;">
            <img 
              src="${thumbnailUrl}" 
              alt="${title}"
              style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 24px;"
            />
            <h1 style="color: #047857; font-weight: 300; margin-top: 0;">${title}</h1>
            <p style="color: #4B5563; line-height: 1.6;">${excerpt}</p>
            <a 
              href="https://vayu-prana.com/vidhya/${slug}" 
              style="display: inline-block; background: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 9999px; margin-top: 24px; font-weight: 300;"
            >
              Read More
            </a>
            <hr style="margin: 32px 0; border: 0; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px;">
              You're receiving this email because you subscribed to Vayu blog updates.
              <a 
                href="https://vayu-prana.com/unsubscribe?email=${email}" 
                style="color: #047857;"
              >
                Unsubscribe
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}