import nodemailer from 'nodemailer';

// Create reusable transporter object using SendGrid SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'apikey', // SendGrid username is always 'apikey'
    pass: process.env.SENDGRID_API_KEY // Your SendGrid API Key
  }
});

export async function sendTestEmailWithSendGrid() {
  try {
    const info = await transporter.sendMail({
      from: '"Vayu" <noreply@vayu-prana.com>', // Make sure this is your verified sender
      to: "hello@dhruvaryan.com",
      subject: "Test Email from Vayu (SendGrid)",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Test Email from Vayu</h1>
          <p>This is a test email sent using SendGrid at ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `
    });

    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      message: "Test email sent successfully",
      data: { messageId: info.messageId }
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email"
    };
  }
}