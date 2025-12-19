import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    createBookingOrder,
    verifyPaymentAndBook,
    clearOrder,
} from "../features/booking/bookingSlice";
import { loadRazorpay } from "../utils/razorpay";

const BookingModal = ({ tour, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { order, orderLoading, orderError, loading } = useSelector(
        (state) => state.booking
    );

    const [formData, setFormData] = useState({
        numberOfGuests: 1,
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
    });

    useEffect(() => {
        if (orderError) {
            toast.error(orderError, { theme: "colored" });
            dispatch(clearOrder());
        }
    }, [orderError, dispatch]);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user || !user.token) {
            toast.error("Please login to book a tour", { theme: "colored" });
            return;
        }

        // Validate form
        if (!formData.name || !formData.email || !formData.phone) {
            toast.error("Please fill all fields", { theme: "colored" });
            return;
        }

        if (formData.numberOfGuests < 1 || formData.numberOfGuests > tour.availableSlots) {
            toast.error(
                `Number of guests must be between 1 and ${tour.availableSlots}`,
                { theme: "colored" }
            );
            return;
        }

        try {
            const orderResult = await dispatch(
                createBookingOrder({
                    tourId: tour._id,
                    numberOfGuests: parseInt(formData.numberOfGuests),
                })
            ).unwrap();

            console.log("Order created successfully:", orderResult);
            toast.success("Order created. Please proceed with payment.", {
                theme: "colored",
            });
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error(error || "Failed to create order", { theme: "colored" });
        }
    };

    const handlePayment = async () => {
        if (!order) {
            toast.error("Please create order first", { theme: "colored" });
            return;
        }

        // Get Razorpay key from order (sent by backend) or environment variable
        const razorpayKey = order.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
        
        if (!razorpayKey) {
            toast.error(
                "Payment gateway not configured. Please contact administrator.",
                { theme: "colored", autoClose: 5000 }
            );
            return;
        }

        try {
            // Load Razorpay script
            await loadRazorpay();

            if (!window.Razorpay) {
                toast.error("Failed to load Razorpay payment gateway", { theme: "colored" });
                return;
            }

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "Travelify",
                description: `Booking for ${order.tour.title}`,
                order_id: order.orderId,
                handler: async function (response) {
                    // Verify payment on backend
                    try {
                        console.log("Payment success response:", response);
                        
                        // Validate response
                        if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
                            toast.error("Invalid payment response. Please contact support.", {
                                theme: "colored",
                            });
                            return;
                        }

                        await dispatch(
                            verifyPaymentAndBook({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                tourId: tour._id,
                                numberOfGuests: parseInt(formData.numberOfGuests),
                                guestDetails: {
                                    name: formData.name,
                                    email: formData.email,
                                    phone: formData.phone,
                                },
                            })
                        ).unwrap();

                        toast.success("Booking successful! Check your email for confirmation.", {
                            theme: "colored",
                        });
                        dispatch(clearOrder());
                        onClose();
                        // Navigate to My Bookings page
                        setTimeout(() => {
                            window.location.href = "/my-bookings";
                        }, 1000);
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error(error || "Payment verification failed", {
                            theme: "colored",
                        });
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#6366f1",
                },
                modal: {
                    ondismiss: function () {
                        toast.info("Payment cancelled", { theme: "colored" });
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            
            // Add error event listener
            razorpay.on('payment.failed', function(response) {
                console.error("Payment failed:", response);
                const errorMsg = response.error?.description || response.error?.reason || response.error?.code || "Payment failed. Please try again.";
                toast.error(`Payment failed: ${errorMsg}`, { 
                    theme: "colored", 
                    autoClose: 5000 
                });
            });

            // Handle payment errors
            razorpay.on('payment.authorized', function(response) {
                console.log("Payment authorized:", response);
            });

            razorpay.open();
        } catch (error) {
            console.error("Razorpay initialization error:", error);
            toast.error("Failed to load payment gateway. Please try again.", { theme: "colored" });
        }
    };

    if (!isOpen) return null;

    const totalAmount = tour.price * formData.numberOfGuests;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-indigo-600 text-white p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Book Your Tour</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Tour Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {tour.title}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Location:</span>{" "}
                                <span className="font-medium">{tour.location}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Price per person:</span>{" "}
                                <span className="font-medium">
                                    ₹{tour.price.toLocaleString("en-IN")}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Available Slots:</span>{" "}
                                <span className="font-medium">{tour.availableSlots}</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    {!order ? (
                        <form onSubmit={handleCreateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Guests *
                                </label>
                                <input
                                    type="number"
                                    name="numberOfGuests"
                                    min="1"
                                    max={tour.availableSlots}
                                    value={formData.numberOfGuests}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Total Amount */}
                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-700">
                                        Total Amount:
                                    </span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={orderLoading}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {orderLoading ? "Creating Order..." : "Proceed to Payment"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <p className="text-green-800 font-medium">
                                    Order created successfully! Click below to proceed with payment.
                                </p>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-semibold text-gray-700">
                                        Amount to Pay:
                                    </span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{order.totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        dispatch(clearOrder());
                                        setFormData({
                                            ...formData,
                                            numberOfGuests: 1,
                                        });
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Processing..." : "Pay Now"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;

