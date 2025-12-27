import dotenv from "dotenv";
import { sendEmail } from "./config/sendEmail.js";

dotenv.config();

const testEmail = async () => {
    try {
        console.log("🧪 Testing email configuration...");
        console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
        console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set");
        
        const testResult = await sendEmail(
            "satyamsawant54@gmail.com", // Send to your own email
            "Test Email - Travelify",
            "This is a test email to verify the email configuration is working properly."
        );
        
        console.log("✅ Test email sent successfully!");
        console.log("📧 Result:", testResult);
        
    } catch (error) {
        console.error("❌ Test email failed:", error);
    }
};

testEmail();