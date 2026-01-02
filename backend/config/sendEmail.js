import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
    try {
        console.log("📧 Attempting to send email to:", to);
        console.log("📧 Subject:", subject);
        
        // Force real email sending
        const forceRealEmail = process.env.FORCE_REAL_EMAIL === "true";
        const isDevelopment = process.env.NODE_ENV === "development" && !forceRealEmail;
        
        if (isDevelopment) {
            // Mock email for development - just log it
            console.log("📧 DEVELOPMENT MODE - Email would be sent:");
            console.log("📧 From: Travelify Team <satyam@travelify.com>");
            console.log("📧 To:", to);
            console.log("📧 Subject:", subject);
            console.log("📧 Content:");
            console.log("=" .repeat(50));
            console.log(text);
            console.log("=" .repeat(50));
            console.log("📧 Email logged successfully (Development Mode)");
            return { messageId: `mock_${Date.now()}` };
        }
        
        console.log("📧 PRODUCTION MODE - Sending real email...");
        
        // Create transporter with better Gmail configuration
        console.log("📧 Using Gmail with business email display");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.BUSINESS_EMAIL_USER || process.env.EMAIL_USER,
                pass: process.env.BUSINESS_EMAIL_PASS || process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        console.log("📧 Verifying email configuration...");
        await transporter.verify();
        console.log("📧 Email transporter verified successfully");

        const mailOptions = {
            from: '"Travelify Team" <satyam@travelify.com>',
            replyTo: process.env.BUSINESS_EMAIL_USER || process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: `<pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${text}</pre>`
        };

        console.log("📧 Sending email...");
        const result = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent successfully:", result.messageId);
        console.log("📧 Response:", result.response);
        return result;
        
    } catch (error) {
        console.error("📧 Email sending failed:", error);
        console.error("📧 Error details:", {
            code: error.code,
            command: error.command,
            response: error.response
        });
        
        // In development, don't fail - just log
        if (process.env.NODE_ENV === "development") {
            console.log("📧 Development mode: Continuing despite email failure");
            console.log("📧 Email content that would have been sent:");
            console.log("📧 From: Travelify Team <satyam@travelify.com>");
            console.log("📧 To:", to);
            console.log("📧 Subject:", subject);
            console.log("📧 Content:", text);
            return { messageId: `mock_failed_${Date.now()}` };
        }
        
        throw error;
    }
};