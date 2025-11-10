import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import { sendEmail } from "../config/sendEmail.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc Create payment order
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error creating payment order" });
    }
};

// @desc Verify payment and create booking
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            tourId,
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            const tour = await Tour.findById(tourId);
            if (!tour) return res.status(404).json({ message: "Tour not found" });

            const booking = await Booking.create({
                user: userId,
                tour: tourId,
                amount: tour.price,
                paymentId: razorpay_payment_id,
                status: "Pending",
            });

            await sendEmail({
                to: req.user.email,
                subject: "Booking Received!",
                text: `Your booking for ${tour.title} has been received. Await admin approval.`,
            });

            res.json({ success: true, message: "Payment verified", booking });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ message: "Payment verification failed" });
    }
};

// @desc Admin: Approve or cancel booking
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findById(id).populate("user").populate("tour");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        booking.status = status;
        await booking.save();

        // Send email to user about booking update
        const message =
            status === "Approved"
                ? `Your booking for ${booking.tour.title} is approved!`
                : `Your booking for ${booking.tour.title} has been cancelled.`;

        await sendEmail({
            to: booking.user.email,
            subject: `Booking ${status}`,
            text: message,
        });

        res.json({ message: "Booking status updated", booking });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking status" });
    }
};
