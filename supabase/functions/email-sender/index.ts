import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Parse request body
    const { to, subject, html } = await req.json()
    if (!to || !subject || !html) {
      throw new Error("Missing required fields")
    }

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Vayu <breath@vayu-prana.com>',
      to,
      subject,
      html
    })

    if (error) {
      throw error
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        data
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
        error: error instanceof Error ? error.message : 'Failed to send email'
      }),
      {
        headers: corsHeaders,
        status: 500
      }
    )
  }
})