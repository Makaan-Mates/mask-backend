// sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config()

const sendEmail = async (email, verificationCode) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rathoursourabh45@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });

    await transporter.sendMail({
        from: 'rathoursourabh45@gmail.com',
        to: email, 
        subject: 'Email Verification for Mask', 
        text: `Your verification code is: ${verificationCode}`, 
    });

    // console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;