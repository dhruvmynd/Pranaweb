import { supabase } from './supabase';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke<EmailResponse>(
      'email-sender',
      {
        body: options,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      }
    );

    if (error) {
      throw error;
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Failed to send email');
    }

    return {
      success: true,
      message: data.message
    };

  } catch (error) {
    console.error('Send email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}

export async function sendTestEmail(): Promise<EmailResponse> {
  const emailContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Inter, system-ui, sans-serif; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="background-color: white; border-radius: 8px; padding: 32px; margin: 20px 0;">
            <h1 style="color: #047857;">Test Email from Vayu</h1>
            <p style="color: #4B5563; line-height: 1.6;">
              This is a test email to verify the email delivery system is working correctly.
            </p>
            <p style="color: #4B5563;">Sent at: ${new Date().toLocaleString()}</p>
            <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 14px;">
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: 'hello@dhruvaryan.com',
    subject: 'Test Email from Vayu',
    html: emailContent
  });
}