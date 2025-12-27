import dotenv from "dotenv";
import mongoose from "mongoose";
import { sendEmail } from "./config/sendEmail.js";
import Booking from "./models/bookingModel.js";
import Tour from "./models/tourModel.js"; // Import Tour model

dotenv.config();

const testRejectionEmail = async () => {
    try {
        console.log("🧪 Testing rejection email...");
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        // Find a booking by the user satyamsawant54@gmail.com
        const booking = await Booking.findOne({
            "guestDetails.email": "satyamsawant54@gmail.com"
        }).populate("tour", "title location");
        
        if (!booking) {
            console.log("❌ No booking found for satyamsawant54@gmail.com");
            console.log("💡 Please make a booking first, then run this test");
            return;
        }
        
        console.log("✅ Found booking:", booking._id);
        console.log("📧 Tour:", booking.tour.title);
        console.log("📧 Guest:", booking.guestDetails.name);
        
        // Test rejection email
        const rejectionReason = "Slots are not available, better luck next time. Thank you for your time.";
        
        const emailSubject = "Booking Cancelled - Travelify";
        const emailText = `
Dear ${booking.guestDetails.name},

We regret to inform you that your booking has been cancelled by our admin.

Booking Details:
- Tour: ${booking.tour.title}
- Location: ${booking.tour.location}
- Number of Guests: ${booking.numberOfGuests}
- Total Amount: ₹${booking.totalAmount.toLocaleString("en-IN")}
- Booking ID: ${booking._id}
- Booking Status: Cancelled ❌
- Payment Status: Refunded

Reason for Cancellation:
${rejectionReason}

Your payment will be refunded to your original payment method within 5-7 business days.

If you have any questions or concerns, please feel free to contact us.

We apologize for any inconvenience caused and hope to serve you better in the future.

Best regards,
Travelify Team
        `;
        
        const result = await sendEmail(booking.guestDetails.email, emailSubject, emailText);
        console.log("✅ Rejection email test completed!");
        console.log("📧 Result:", result);
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        mongoose.disconnect();
    }
};

testRejectionEmail();