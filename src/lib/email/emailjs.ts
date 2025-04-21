import emailjs from '@emailjs/browser';

// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY");

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Update this after creating the service
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Update this after creating the template

export async function sendTestEmailWithEmailJS() {
  try {
    const templateParams = {
      to_name: 'Admin',
      from_name: 'Vayu System',
      message: `This is a test email sent at ${new Date().toLocaleString()}`,
      reply_to: 'hello@dhruvaryan.com'
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return {
      success: true,
      message: 'Test email sent successfully',
      data: { id: response.status }
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
}