import Booking from "../models/bookingModel.js";
import Tour from "../models/tourModel.js";
import User from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendEmail } from "../config/sendEmail.js";

// Initialize Razorpay
let razorpay;
try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn("⚠️ Razorpay credentials not found in environment variables");
    } else {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
} catch (error) {
    console.error("Error initializing Razorpay:", error);
}

/**
 * @desc    Create Razorpay order for booking
 * @route   POST /api/bookings/create-order
 * @access  Private
 */
export const createOrder = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Check if Razorpay is initialized
        if (!razorpay) {
            return res.status(500).json({ 
                message: "Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables." 
            });
        }

        const { tourId, numberOfGuests } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!tourId || !numberOfGuests || numberOfGuests < 1) {
            return res.status(400).json({ message: "Tour ID and number of guests are required" });
        }

        // Get tour details
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Check available slots
        if (tour.availableSlots < numberOfGuests) {
            return res.status(400).json({ 
                message: `Only ${tour.availableSlots} slots available` 
            });
        }

        // Calculate total amount in paise (Razorpay requires amount in smallest currency unit)
        // Minimum amount is 100 paise (₹1) for Razorpay
        // Ensure amount is an integer
        const totalAmountPaise = Math.max(Math.round(tour.price * numberOfGuests * 100), 100);

        // Create Razorpay order
        // Receipt must be max 40 characters, so we'll use a shorter format
        const receiptId = `B${Date.now()}${userId.toString().slice(-6)}`.slice(0, 40);
        
        const options = {
            amount: totalAmountPaise, // Must be integer in paise
            currency: "INR",
            receipt: receiptId,
            payment_capture: 1, // Auto capture payment
            notes: {
                tourId: tourId.toString(),
                userId: userId.toString(),
                numberOfGuests: numberOfGuests.toString(),
            },
        };

        console.log("Creating Razorpay order with:", {
            amount: totalAmountPaise,
            currency: options.currency,
            receipt: receiptId
        });

        const order = await razorpay.orders.create(options);
        
        console.log("Razorpay order created:", order.id);

        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: parseInt(order.amount), // Ensure it's an integer
            currency: order.currency,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID, // Send key ID to frontend
            tour: {
                _id: tour._id,
                title: tour.title,
                price: tour.price,
            },
            numberOfGuests,
            totalAmount: totalAmountPaise / 100,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        
        // Provide more specific error messages
        let errorMessage = "Error creating payment order";
        
        if (error.error && error.error.description) {
            errorMessage = error.error.description;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        // Check if it's a Razorpay authentication error
        if (error.statusCode === 401 || errorMessage.includes("key") || errorMessage.includes("authentication")) {
            errorMessage = "Razorpay authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file";
        }
        
        res.status(500).json({ 
            message: errorMessage,
            error: process.env.NODE_ENV === "development" ? {
                message: error.message,
                statusCode: error.statusCode,
                error: error.error
            } : undefined
        });
    }
};

/**
 * @desc    Verify payment and create booking
 * @route   POST /api/bookings/verify-payment
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { 
            orderId, 
            paymentId, 
            signature, 
            tourId, 
            numberOfGuests,
            guestDetails 
        } = req.body;

        const userId = req.user._id;

        // Validate input
        if (!orderId || !paymentId || !signature || !tourId || !numberOfGuests || !guestDetails) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if Razorpay is initialized
        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ 
                message: "Payment gateway not configured. Please set RAZORPAY_KEY_SECRET in environment variables." 
            });
        }

        // Verify payment signature (skip for mock payments)
        if (!signature.startsWith('mock_signature_')) {
            const generatedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(`${orderId}|${paymentId}`)
                .digest("hex");

            if (generatedSignature !== signature) {
                return res.status(400).json({ message: "Invalid payment signature" });
            }
        } else {
            console.log("Mock payment detected, skipping signature verification");
        }

        // Get tour details
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Check available slots again
        if (tour.availableSlots < numberOfGuests) {
            return res.status(400).json({ 
                message: `Only ${tour.availableSlots} slots available` 
            });
        }

        const totalAmount = tour.price * numberOfGuests;

        // Create booking
        const booking = await Booking.create({
            tour: tourId,
            user: userId,
            numberOfGuests,
            totalAmount,
            paymentStatus: "completed",
            bookingStatus: "pending", // Admin needs to confirm
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            guestDetails,
        });

        // Update tour available slots
        tour.availableSlots -= numberOfGuests;
        await tour.save();

        // Populate booking details
        await booking.populate("tour", "title location price image");
        await booking.populate("user", "name email");

        // Send confirmation email to user
        const emailSubject = "Booking Confirmation - Travelify";
        const emailText = `
Dear ${guestDetails.name},

Thank you for booking with Travelify!

Your booking details:
- Tour: ${tour.title}
- Location: ${tour.location}
- Number of Guests: ${numberOfGuests}
- Total Amount: ₹${totalAmount.toLocaleString("en-IN")}
- Booking ID: ${booking._id}
- Booking Status: Pending Admin Approval

Your booking is currently pending approval. You will receive an email once the admin confirms your booking.

We look forward to serving you!

Best regards,
Travelify Team
        `;

        try {
            await sendEmail(guestDetails.email, emailSubject, emailText);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Don't fail the booking if email fails
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully. Payment verified.",
            booking,
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment" });
    }
};

/**
 * @desc    Get all bookings for logged-in user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ user: userId })
            .populate("tour", "title location price image category subcategory")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

/**
 * @desc    Get all bookings (Admin only)
 * @route   GET /api/bookings/all
 * @access  Private/Admin
 */
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("tour", "title location price image category subcategory")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

/**
 * @desc    Get single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("tour", "title location price image category subcategory description")
            .populate("user", "name email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if user owns the booking or is admin
        if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "Not authorized to view this booking" });
        }

        res.json({
            success: true,
            booking,
        });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Error fetching booking" });
    }
};

/**
 * @desc    Confirm booking (Admin only)
 * @route   PUT /api/bookings/:id/confirm
 * @access  Private/Admin
 */
export const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("tour", "title location")
            .populate("user", "name email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.bookingStatus === "confirmed") {
            return res.status(400).json({ message: "Booking already confirmed" });
        }

        if (booking.bookingStatus === "cancelled") {
            return res.status(400).json({ message: "Cannot confirm a cancelled booking" });
        }

        booking.bookingStatus = "confirmed";
        await booking.save();

        // Send confirmation email to user
        const emailSubject = "Booking Confirmed - Travelify";
        const emailText = `
Dear ${booking.guestDetails.name},

Great news! Your booking has been confirmed by our admin.

Booking Details:
- Tour: ${booking.tour.title}
- Location: ${booking.tour.location}
- Number of Guests: ${booking.numberOfGuests}
- Total Amount: ₹${booking.totalAmount.toLocaleString("en-IN")}
- Booking ID: ${booking._id}
- Booking Status: Confirmed ✅

We are excited to have you join us on this amazing journey!

If you have any questions, please feel free to contact us.

Best regards,
Travelify Team
        `;

        try {
            await sendEmail(booking.guestDetails.email, emailSubject, emailText);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        res.json({
            success: true,
            message: "Booking confirmed successfully",
            booking,
        });
    } catch (error) {
        console.error("Error confirming booking:", error);
        res.status(500).json({ message: "Error confirming booking" });
    }
};

/**
 * @desc    Cancel booking (Admin only)
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private/Admin
 */
export const cancelBooking = async (req, res) => {
    try {
        const { rejectionReason } = req.body; // Get rejection reason from request body
        
        const booking = await Booking.findById(req.params.id)
            .populate("tour", "title location")
            .populate("user", "name email");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.bookingStatus === "cancelled") {
            return res.status(400).json({ message: "Booking already cancelled" });
        }

        // Update booking status
        booking.bookingStatus = "cancelled";
        booking.paymentStatus = "refunded";
        booking.rejectionReason = rejectionReason || "Booking cancelled by admin"; // Store rejection reason
        await booking.save();

        // Return slots to tour
        const tour = await Tour.findById(booking.tour._id);
        if (tour) {
            tour.availableSlots += booking.numberOfGuests;
            await tour.save();
        }

        // Send cancellation email to user with custom reason
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
${rejectionReason || "No specific reason provided."}

Your payment will be refunded to your original payment method within 5-7 business days.

If you have any questions or concerns, please feel free to contact us.

We apologize for any inconvenience caused and hope to serve you better in the future.

Best regards,
Travelify Team
        `;

        try {
            await sendEmail(booking.guestDetails.email, emailSubject, emailText);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking,
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ message: "Error cancelling booking" });
    }
};


/**
 * @desc    Create direct booking without payment
 * @route   POST /api/bookings/direct-booking
 * @access  Private
 */
export const createDirectBooking = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { tourId, numberOfGuests, guestDetails } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!tourId || !numberOfGuests || numberOfGuests < 1 || !guestDetails) {
            return res.status(400).json({ message: "Tour ID, number of guests, and guest details are required" });
        }

        // Validate guest details
        if (!guestDetails.name || !guestDetails.email) {
            return res.status(400).json({ message: "Guest name and email are required" });
        }

        // Get tour details
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Check available slots
        if (tour.availableSlots < numberOfGuests) {
            return res.status(400).json({ 
                message: `Only ${tour.availableSlots} slots available` 
            });
        }

        const totalAmount = tour.price * numberOfGuests;

        // Create booking without payment
        const booking = await Booking.create({
            tour: tourId,
            user: userId,
            numberOfGuests,
            totalAmount,
            paymentStatus: "pending", // No payment required
            bookingStatus: "confirmed", // Directly confirmed
            guestDetails,
        });

        // Update tour available slots
        tour.availableSlots -= numberOfGuests;
        await tour.save();

        // Populate booking details
        await booking.populate("tour", "title location price image");
        await booking.populate("user", "name email");

        // Send confirmation email to user
        const emailSubject = "Booking Confirmation - Travelify";
        const emailText = `
Dear ${guestDetails.name},

Thank you for booking with Travelify!

Your booking details:
- Tour: ${tour.title}
- Location: ${tour.location}
- Number of Guests: ${numberOfGuests}
- Total Amount: ₹${totalAmount.toLocaleString("en-IN")}
- Booking ID: ${booking._id}
- Booking Status: Confirmed ✅

Your booking has been confirmed successfully! We look forward to serving you on this amazing journey.

If you have any questions, please feel free to contact us.

Best regards,
Travelify Team
        `;

        try {
            await sendEmail(guestDetails.email, emailSubject, emailText);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            // Don't fail the booking if email fails
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            booking,
        });
    } catch (error) {
        console.error("Error creating direct booking:", error);
        res.status(500).json({ message: "Error creating booking" });
    }
};