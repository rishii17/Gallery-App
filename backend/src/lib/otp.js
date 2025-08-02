import nodemailer from 'nodemailer';

/**
 * Generates a random 6-digit OTP.
 * @returns {string} The 6-digit OTP as a string.
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an email containing the OTP.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to send.
 * @param {string} subject - The subject line of the email.
 */
export const sendOTPEmail = async (email, otp, subject) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Media Gallery" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #0056b3;">Your Verification Code</h2>
          <p>Please use the following One-Time Password (OTP) to complete your action. This code is valid for 10 minutes.</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #007BFF; text-align: center; margin: 20px 0;">${otp}</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Could not send OTP email.');
  }
};