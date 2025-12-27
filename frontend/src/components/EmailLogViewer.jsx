import { useState } from "react";

const EmailLogViewer = ({ booking }) => {
    const [showEmailPreview, setShowEmailPreview] = useState(false);

    if (!booking || booking.bookingStatus !== "cancelled") {
        return null;
    }

    const generateEmailContent = () => {
        return `Dear ${booking.guestDetails.name},

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
${booking.rejectionReason || "No specific reason provided."}

Your payment will be refunded to your original payment method within 5-7 business days.

If you have any questions or concerns, please feel free to contact us.

We apologize for any inconvenience caused and hope to serve you better in the future.

Best regards,
Travelify Team`;
    };

    return (
        <div className="mt-3">
            <button
                onClick={() => setShowEmailPreview(!showEmailPreview)}
                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-lg transition"
            >
                {showEmailPreview ? "Hide" : "Show"} Email Content
            </button>
            
            {showEmailPreview && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-semibold text-gray-800">
                            📧 Email Sent to User
                        </h4>
                        <div className="text-xs text-gray-500">
                            <div>From: Travelify Team &lt;satyam@travelify.com&gt;</div>
                            <div>To: {booking.guestDetails.email}</div>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded border text-sm text-gray-700 whitespace-pre-line font-mono">
                        {generateEmailContent()}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        💡 In development mode, this email is logged to console instead of being sent.
                    </p>
                </div>
            )}
        </div>
    );
};

export default EmailLogViewer;