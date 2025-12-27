import dotenv from "dotenv";
import { sendEmail } from "./config/sendEmail.js";

dotenv.config();

const testRealEmail = async () => {
    try {
        console.log("🧪 Testing real email sending...");
        console.log("📧 From email:", process.env.EMAIL_USER);
        
        // Test with a different email address (you can change this to any email you want to test)
        const testToEmail = "test@example.com"; // Change this to your personal email or friend's email
        
        const emailSubject = "Test Email from Travelify - Real Email Test";
        const emailText = `
Hello!

This is a test email from Travelify booking system.

If you receive this email, it means the email configuration is working correctly!

Test Details:
- Sent from: Travelify Team <satyam@travelify.com>
- Actual sender: ${process.env.EMAIL_USER}
- Test time: ${new Date().toLocaleString()}
- System: Travelify Booking Platform

Best regards,
Travelify Team
        `;
        
        console.log("📧 Attempting to send to:", testToEmail);
        const result = await sendEmail(testToEmail, emailSubject, emailText);
        console.log("✅ Real email test completed!");
        console.log("📧 Result:", result);
        
    } catch (error) {
        console.error("❌ Real email test failed:", error);
        
        if (error.code === 'EAUTH') {
            console.log("\n🔧 Gmail Authentication Error Solutions:");
            console.log("1. Enable 2-Factor Authentication on your Gmail account");
            console.log("2. Generate a new App Password:");
            console.log("   - Go to: https://myaccount.google.com/security");
            console.log("   - Click '2-Step Verification' → 'App passwords'");
            console.log("   - Generate password for 'Mail' application");
            console.log("   - Update EMAIL_PASS in .env file");
            console.log("3. Or use a different email service like SendGrid/Mailgun");
        }
    }
};

testRealEmail();