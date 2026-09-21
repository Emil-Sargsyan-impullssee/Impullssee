const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, projectType, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !projectType || !budget || !message) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email address'
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedProjectType = sanitizeInput(projectType);
    const sanitizedBudget = sanitizeInput(budget);
    const sanitizedMessage = sanitizeInput(message);

    // Validate field lengths
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return res.status(400).json({
        error: 'Name must be between 2 and 100 characters'
      });
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return res.status(400).json({
        error: 'Message must be between 10 and 2000 characters'
      });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return res.status(500).json({
        error: 'Email service not configured'
      });
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error('CONTACT_EMAIL is not configured');
      return res.status(500).json({
        error: 'Contact email not configured'
      });
    }

    // Send email using Resend
    const emailData = {
      from: 'Impullssee Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL,
      reply_to: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0b0f19; color: #a3e635; padding: 20px; text-align: center; }
            .content { background: #f5f5f5; padding: 20px; border-radius: 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0b0f19; }
            .value { color: #333; margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${sanitizedName}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${sanitizedEmail}</div>
              </div>
              <div class="field">
                <div class="label">Project Type:</div>
                <div class="value">${sanitizedProjectType}</div>
              </div>
              <div class="field">
                <div class="label">Budget:</div>
                <div class="value">${sanitizedBudget}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the Impullssee portfolio contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await resend.emails.send(emailData);

    console.log('Email sent successfully:', result);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);

    // Handle specific Resend errors
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({
        error: 'Email service configuration error'
      });
    }

    res.status(500).json({
      error: 'Failed to send message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

module.exports = router;
