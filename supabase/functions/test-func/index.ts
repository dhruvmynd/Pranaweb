// supabase/functions/test-func/index.ts

import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

Deno.serve(async (req) => {
  // Log function start
  console.log("Email function started");

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // Get and verify Resend API key
    const resendKey = Deno.env.get('RESEND_API_KEY')
    console.log("Resend API key present:", !!resendKey);

    if (!resendKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    // Initialize Resend
    console.log("Initializing Resend...");
    const resend = new Resend(resendKey)

    // Send email
    console.log("Attempting to send email...");
    const { data, error } = await resend.emails.send({
      from: 'Vayu <breath@vayu-prana.com>',
      to: ['hello@dhruvaryan.com'],
      subject: 'Test Email from Vayu',
      html: `
        <div>
          <h1>Test Email</h1>
          <p>This is a test email sent at ${new Date().toISOString()}</p>
        </div>
      `
    })

    if (error) {
      console.error("Email send error:", error);
      throw error
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        data: data
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    )

  } catch (error) {
    console.error("Function error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    )
  }
})