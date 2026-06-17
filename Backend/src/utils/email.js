require('dotenv').config();
const nodemailer=require('nodemailer');

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service:'gmail',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.APP_USERNAME,
    pass: process.env.APP_PASSWORD,
  },
});

async function SendMail(to, otp) {
  await transporter.sendMail({
    from: `"Support" <${process.env.APP_USERNAME}>`,
    to,
    subject: "🔐 Verify Your Email",
    html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f4f7fb;
        padding: 40px 20px;
        text-align: center;
      ">
        <div style="
          max-width: 500px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          padding: 30px;
        ">
          <h2 style="color: #2563eb; margin-bottom: 10px;">Vingo Verification</h2>
          <p style="font-size: 15px; color: #555; margin-bottom: 25px;">
            Hello 👋,<br />
            Please use the following One-Time Password (OTP) to verify your account.
          </p>

          <div style="
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #9333ea);
            color: #ffffff;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            border-radius: 10px;
            padding: 15px 30px;
            margin: 10px 0;
          ">
            ${otp}
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 25px;">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 13px; color: #999;">
            If you didn’t request this, please ignore this email.<br />
            Need help? Contact us at
            <a href="mailto:support@vingo.com" style="color: #2563eb; text-decoration: none;">support@vingo.com</a>
          </p>
        </div>

        <p style="font-size: 12px; color: #aaa; margin-top: 20px;">
          © ${new Date().getFullYear()} Vingo Technologies. All rights reserved.
        </p>
      </div>
    `,
  });
}

module.exports = SendMail;