import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

interface RequestData {
  post_id: string;
  title: string;
  excerpt: string;
  slug: string;
  thumbnail_url: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  let supabaseClient;
  let resend;

  try {
    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('Missing RESEND_API_KEY');
    }
    resend = new Resend(resendApiKey);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request data
    const requestData: RequestData = await req.json();
    const { post_id, title, excerpt, slug, thumbnail_url } = requestData;

    if (!post_id || !title || !excerpt || !slug || !thumbnail_url) {
      throw new Error('Missing required fields');
    }

    // Get active subscribers
    const { data: subscribers, error: subscriberError } = await supabaseClient
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
        // Send emails in parallel within each batch
        const results = await Promise.all(
          batch.map(subscriber => 
            resend.emails.send({
              from: 'Vayu <breath@vayu-prana.com>',
              to: subscriber.email,
              subject: `New Post: ${title}`,
              html: createEmailTemplate(title, excerpt, slug, thumbnail_url, subscriber.email)
            })
          )
        );
        
        // Count successes and failures
        results.forEach((result, index) => {
          if (result.error) {
            failedEmails.push(batch[index].email);
          } else {
            successCount++;
          }
        });

        // Small delay between batches
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Batch error:', error);
        batch.forEach(subscriber => failedEmails.push(subscriber.email));
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully sent ${successCount} emails${
          failedEmails.length > 0 ? `, ${failedEmails.length} failed` : ''
        }`,
        data: { 
          sentCount: successCount,
          failedCount: failedEmails.length
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Function error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: corsHeaders,
        status: 400
      }
    );
  }
});

function createEmailTemplate(title: string, excerpt: string, slug: string, thumbnailUrl: string, email: string) {
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