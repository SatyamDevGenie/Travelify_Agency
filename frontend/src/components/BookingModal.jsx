import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    createBookingOrder,
    verifyPaymentAndBook,
    createDirectBooking,
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

    const [bookingType, setBookingType] = useState("payment"); // "direct" or "payment" - default to payment to show test mode
    const [useMockPayment, setUseMockPayment] = useState(true); // Enable mock payment by default

    // Debug log
    console.log("BookingModal - Current booking type:", bookingType);

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

    const handleDirectBooking = async (e) => {
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
            await dispatch(
                createDirectBooking({
                    tourId: tour._id,
                    numberOfGuests: parseInt(formData.numberOfGuests),
                    guestDetails: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                    },
                })
            ).unwrap();

            toast.success("Booking confirmed! Check your email for details.", {
                theme: "colored",
            });
            onClose();
            // Navigate to My Bookings page
            setTimeout(() => {
                window.location.href = "/my-bookings";
            }, 1000);
        } catch (error) {
            console.error("Direct booking error:", error);
            toast.error(error || "Failed to create booking", { theme: "colored" });
        }
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

    const handleMockPayment = async () => {
        if (!order) {
            toast.error("Please create order first", { theme: "colored" });
            return;
        }

        try {
            // Simulate payment processing
            toast.info("Processing mock payment...", { theme: "colored" });
            
            // Wait 2 seconds to simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create mock payment response
            const mockPaymentResponse = {
                razorpay_order_id: order.orderId,
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                razorpay_signature: `mock_signature_${Date.now()}`
            };

            // Verify mock payment on backend
            await dispatch(
                verifyPaymentAndBook({
                    orderId: mockPaymentResponse.razorpay_order_id,
                    paymentId: mockPaymentResponse.razorpay_payment_id,
                    signature: mockPaymentResponse.razorpay_signature,
                    tourId: tour._id,
                    numberOfGuests: parseInt(formData.numberOfGuests),
                    guestDetails: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                    },
                })
            ).unwrap();

            toast.success("Mock payment successful! Booking confirmed.", {
                theme: "colored",
            });
            dispatch(clearOrder());
            onClose();
            // Navigate to My Bookings page
            setTimeout(() => {
                window.location.href = "/my-bookings";
            }, 1000);
        } catch (error) {
            console.error("Mock payment error:", error);
            toast.error(error || "Mock payment failed", {
                theme: "colored",
            });
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
                method: {
                    card: true,
                    netbanking: true,
                    wallet: true,
                    upi: true
                },
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
                let errorMsg = "Payment failed. Please try again.";
                
                if (response.error?.description) {
                    errorMsg = response.error.description;
                    
                    // Handle international card error specifically
                    if (errorMsg.includes("International cards are not supported")) {
                        errorMsg = "Please use Indian test cards: 5555 5555 5555 4444 (Mastercard) or 4000 0035 6000 0008 (Visa India)";
                    }
                }
                
                toast.error(`Payment failed: ${errorMsg}`, { 
                    theme: "colored", 
                    autoClose: 8000 
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
                        <form onSubmit={bookingType === "direct" ? handleDirectBooking : handleCreateOrder} className="space-y-4">
                            {/* Booking Type Selection - PROMINENT */}
                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                                    🎯 Choose Your Booking Method
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 cursor-pointer transition-all">
                                        <input
                                            type="radio"
                                            name="bookingType"
                                            value="direct"
                                            checked={bookingType === "direct"}
                                            onChange={(e) => setBookingType(e.target.value)}
                                            className="mr-3 text-green-600 scale-125"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-gray-800 block">
                                                ✅ Book Now (Free)
                                            </span>
                                            <span className="text-xs text-gray-600">
                                                No payment required
                                            </span>
                                        </div>
                                    </label>
                                    <label className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-400 cursor-pointer transition-all">
                                        <input
                                            type="radio"
                                            name="bookingType"
                                            value="payment"
                                            checked={bookingType === "payment"}
                                            onChange={(e) => setBookingType(e.target.value)}
                                            className="mr-3 text-indigo-600 scale-125"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-gray-800 block">
                                                💳 Pay with Card (Test)
                                            </span>
                                            <span className="text-xs text-gray-600">
                                                Dummy payment mode
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                {bookingType === "payment" && (
                                    <div className="mt-4 space-y-3">
                                        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id="mockPayment"
                                                    checked={useMockPayment}
                                                    onChange={(e) => setUseMockPayment(e.target.checked)}
                                                    className="mr-2 text-green-600"
                                                />
                                                <label htmlFor="mockPayment" className="text-sm font-bold text-green-900">
                                                    🎭 Use Mock Payment (Recommended)
                                                </label>
                                            </div>
                                            <p className="text-xs text-green-800">
                                                Simulates payment without Razorpay gateway. Perfect for testing!
                                            </p>
                                        </div>
                                        
                                        {!useMockPayment && (
                                            <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                                                <p className="text-sm text-blue-900 font-medium">
                                                    🧪 <strong>REAL RAZORPAY TEST MODE</strong>
                                                </p>
                                                <p className="text-xs text-blue-800 mt-1">
                                                    <strong>Test Payment Options:</strong><br/>
                                                    <strong>1. Indian Cards:</strong><br/>
                                                    • Mastercard: <code className="bg-blue-200 px-1 rounded">5555 5555 5555 4444</code><br/>
                                                    • Visa India: <code className="bg-blue-200 px-1 rounded">4000 0035 6000 0008</code><br/>
                                                    CVV: <code className="bg-blue-200 px-1 rounded">123</code>, Expiry: <code className="bg-blue-200 px-1 rounded">12/25</code><br/>
                                                    <strong>2. UPI (Recommended):</strong><br/>
                                                    • Success: <code className="bg-blue-200 px-1 rounded">success@razorpay</code><br/>
                                                    • Failure: <code className="bg-blue-200 px-1 rounded">failure@razorpay</code>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                    disabled={loading || orderLoading}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading || orderLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : bookingType === "direct" ? (
                                        <>
                                            ✅ Book Now (Free)
                                        </>
                                    ) : (
                                        <>
                                            💳 Proceed to Test Payment
                                        </>
                                    )}
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
                                    onClick={useMockPayment ? handleMockPayment : handlePayment}
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : useMockPayment ? (
                                        <>
                                            🎭 Pay Now (Mock)
                                        </>
                                    ) : (
                                        <>
                                            💳 Pay Now (Razorpay)
                                        </>
                                    )}
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

