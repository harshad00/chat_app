import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `https://chat-app-zrf6.onrender.com/api/verify-email?token=${token}`;

  const mailOptions = {
    from: `"My Chat App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Click the link to verify your email: <a href="${verificationUrl}">Verify</a> <br/> <i> Harshad Prajapati</i> </p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent');
  } catch (err) {
    console.error('❌ Failed to send verification email:', err);
    throw new Error('Email could not be sent.');
  }
};

export default sendVerificationEmail;
