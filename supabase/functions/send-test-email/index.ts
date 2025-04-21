import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    // Get the Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not found")
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Send the test email
    const { data, error } = await resend.emails.send({
      from: 'Vayu <breath@vayu-prana.com>',
      to: 'hello@dhruvaryan.com',
      subject: 'Test Email from Vayu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Test Email from Vayu</h1>
          <p>This is a test email sent at ${new Date().toISOString()}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `
    })

    if (error) {
      throw error
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Test email sent successfully',
        data: data
      }),
      {
        headers: corsHeaders,
        status: 200
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email'
      }),
      {
        headers: corsHeaders,
        status: 500
      }
    )
  }
})