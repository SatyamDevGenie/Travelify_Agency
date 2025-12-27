import dotenv from "dotenv";
import { sendEmail } from "./config/sendEmail.js";

dotenv.config();

const testBusinessEmail = async () => {
    try {
        console.log("🧪 Testing business email: satyam@travelify.com");
        console.log("📧 SMTP Host:", process.env.BUSINESS_EMAIL_HOST);
        console.log("📧 SMTP Port:", process.env.BUSINESS_EMAIL_PORT);
        console.log("📧 Email User:", process.env.BUSINESS_EMAIL_USER);
        
        // Test sending to your personal email
        const testToEmail = "satyamsawant54@gmail.com"; // Your personal email to receive test
        
        const emailSubject = "Test from Travelify Business Email";
        const emailText = `
Hello!

This is a test email sent from your business email: satyam@travelify.com

If you receive this email, your business email configuration is working perfectly!

Test Details:
- From: satyam@travelify.com
- SMTP Host: ${process.env.BUSINESS_EMAIL_HOST}
- Test Time: ${new Date().toLocaleString()}

Best regards,
Travelify Team
        `;
        
        const result = await sendEmail(testToEmail, emailSubject, emailText);
        console.log("✅ Business email test successful!");
        console.log("📧 Check your inbox:", testToEmail);
        
    } catch (error) {
        console.error("❌ Business email test failed:", error);
        console.log("\n💡 Next steps:");
        console.log("1. Create business email account at chosen provider");
        console.log("2. Update BUSINESS_EMAIL_PASS in .env file");
        console.log("3. Verify SMTP settings are correct");
    }
};

testBusinessEmail();