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

        const totalAmount = tour.price * numberOfGuests * 100; // Convert to paise

        // Create Razorpay order
        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `booking_${Date.now()}_${userId}`,
            notes: {
                tourId: tourId.toString(),
                userId: userId.toString(),
                numberOfGuests: numberOfGuests.toString(),
            },
        };

        const order = await razorpay.orders.create(options);

        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            tour: {
                _id: tour._id,
                title: tour.title,
                price: tour.price,
            },
            numberOfGuests,
            totalAmount: totalAmount / 100,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ 
            message: "Error creating payment order",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
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

        // Verify payment signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
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
        await booking.save();

        // Return slots to tour
        const tour = await Tour.findById(booking.tour._id);
        if (tour) {
            tour.availableSlots += booking.numberOfGuests;
            await tour.save();
        }

        // Send cancellation email to user
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

Your payment will be refunded to your original payment method within 5-7 business days.

If you have any questions or concerns, please feel free to contact us.

We apologize for any inconvenience caused.

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

