const nodemailer = require("nodemailer");

// Create transporter lazily (inside function) so env vars are guaranteed to be loaded
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.APP_USERNAME,
      pass: process.env.APP_PASSWORD,
    },
  });
}

async function SendMail(to, otp) {
  console.log("📧 Attempting to send OTP email to:", to);
  console.log("📧 Using APP_USERNAME:", process.env.APP_USERNAME ? "✅ Set" : "❌ NOT SET");
  console.log("📧 Using APP_PASSWORD:", process.env.APP_PASSWORD ? "✅ Set" : "❌ NOT SET");

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Panda Store" <${process.env.APP_USERNAME}>`,
      to,
      subject: "🐼 Panda Store - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:40px 20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#111827,#374151); padding:30px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:32px;">🐼 Panda Store</h1>
              <p style="color:#d1d5db; margin-top:10px; font-size:14px;">Your Trusted Online Shopping Destination</p>
            </div>
            <div style="padding:40px 30px;">
              <h2 style="color:#111827; margin-bottom:15px;">Verify Your Account</h2>
              <p style="color:#4b5563; line-height:1.7;">
                Hello 👋,<br><br>
                Thank you for joining <strong>Panda Store</strong>. Use the OTP below to verify your account and continue shopping.
              </p>
              <div style="text-align:center; margin:35px 0;">
                <span style="display:inline-block; background:linear-gradient(135deg,#f59e0b,#ef4444); color:white; font-size:34px; font-weight:bold; letter-spacing:8px; padding:18px 35px; border-radius:12px;">
                  ${otp}
                </span>
              </div>
              <p style="color:#6b7280; text-align:center;">This OTP is valid for <strong>10 minutes</strong>.</p>
              <div style="background:#fef3c7; border-left:4px solid #f59e0b; padding:15px; border-radius:8px; margin-top:25px;">
                <strong>Security Tip:</strong> Never share your OTP with anyone.
              </div>
              <hr style="margin:35px 0; border:none; border-top:1px solid #e5e7eb;" />
              <p style="color:#6b7280; font-size:14px;">If you didn't request this verification, you can safely ignore this email.</p>
            </div>
            <div style="background:#f9fafb; padding:20px; text-align:center; border-top:1px solid #e5e7eb;">
              <p style="margin:0; color:#6b7280; font-size:13px;">
                Need help? Contact us at <a href="mailto:support@pandastore.com" style="color:#2563eb; text-decoration:none;">support@pandastore.com</a>
              </p>
              <p style="margin-top:10px; color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} Panda Store. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("✅ OTP email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    console.error("❌ Full error:", error);
    throw error; // Re-throw so controller catches it
  }
}

module.exports = SendMail;
