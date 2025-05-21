const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Register Handlebars helpers
handlebars.registerHelper('eq', function (v1, v2) {
  return v1 === v2;
});

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

// Email templates
const templates = {
  welcome: (name) => ({
    subject: 'Welcome to Job Board',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Job Board!</h1>
        <p>Hello ${name},</p>
        <p>Thank you for registering with Job Board. We're excited to have you on board!</p>
        <p>You can now:</p>
        <ul>
          <li>Create your profile</li>
          <li>Browse job listings</li>
          <li>Apply for jobs</li>
          <li>Save your favorite jobs</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Job Board Team</p>
      </div>
    `
  }),
  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
        <p>Please click on the following link to reset your password:</p>
        <p>
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 10 minutes.</p>
        <p>Best regards,<br>The Job Board Team</p>
      </div>
    `
  }),
  jobApplication: async (data) => {
    const template = await fs.readFile(
      path.join(__dirname, '../templates/job-application.html'),
      'utf-8'
    );
    const compiledTemplate = handlebars.compile(template);
    return {
      subject: `Application Submitted - ${data.jobTitle}`,
      html: compiledTemplate({
        ...data,
        currentYear: new Date().getFullYear()
      })
    };
  },
  applicationStatus: async (data) => {
    const template = await fs.readFile(
      path.join(__dirname, '../templates/application-status.html'),
      'utf-8'
    );
    const compiledTemplate = handlebars.compile(template);
    return {
      subject: `Application Status Update - ${data.jobTitle}`,
      html: compiledTemplate({
        ...data,
        currentYear: new Date().getFullYear()
      })
    };
  }
};

/**
 * Send an email using a template
 * @param {string} to - Recipient email address
 * @param {string} template - Template name
 * @param {Array|Object} data - Data to be used in the template
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (to, template, data = []) => {
  try {
    if (!templates[template]) {
      throw new Error(`Template ${template} not found`);
    }

    const { subject, html } = await templates[template](data);

    const mailOptions = {
      from: `"Job Board" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  templates
}; 