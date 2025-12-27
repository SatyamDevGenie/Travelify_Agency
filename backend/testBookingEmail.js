import dotenv from "dotenv";
import { sendEmail } from "./config/sendEmail.js";

dotenv.config();

const testBookingConfirmationEmail = async () => {
    try {
        console.log("🧪 Testing booking confirmation email...");
        
        // Mock booking data
        const mockBooking = {
            guestDetails: {
                name: "Satyam Developer",
                email: "satyamsawant54@gmail.com"
            },
            tour: {
                title: "Bangkok Adventure",
                location: "Thailand"
            },
            numberOfGuests: 2,
            totalAmount: 400000,
            _id: "mock_booking_123"
        };
        
        // Test booking confirmation email
        const emailSubject = "Booking Confirmation - Travelify";
        const emailText = `
Dear ${mockBooking.guestDetails.name},

Thank you for booking with Travelify!

Your booking details:
- Tour: ${mockBooking.tour.title}
- Location: ${mockBooking.tour.location}
- Number of Guests: ${mockBooking.numberOfGuests}
- Total Amount: ₹${mockBooking.totalAmount.toLocaleString("en-IN")}
- Booking ID: ${mockBooking._id}
- Booking Status: Confirmed ✅

Your booking has been confirmed successfully! We look forward to serving you on this amazing journey.

If you have any questions, please feel free to contact us.

Best regards,
Travelify Team
        `;
        
        const result = await sendEmail(mockBooking.guestDetails.email, emailSubject, emailText);
        console.log("✅ Booking confirmation email test completed!");
        console.log("📧 Result:", result);
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
};

testBookingConfirmationEmail();