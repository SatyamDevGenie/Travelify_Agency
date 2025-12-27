import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../utils/toast";
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
            showToast.error(orderError);
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
            showToast.warning("Please login to book a tour");
            return;
        }

        // Validate form
        if (!formData.name || !formData.email || !formData.phone) {
            showToast.warning("Please fill all fields");
            return;
        }

        if (formData.numberOfGuests < 1 || formData.numberOfGuests > tour.availableSlots) {
            showToast.warning(
                `Number of guests must be between 1 and ${tour.availableSlots}`
            );
            return;
        }

        const bookingPromise = dispatch(
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

        try {
            await showToast.promise(
                bookingPromise,
                {
                    pending: "Creating your booking...",
                    success: `🎉 Booking confirmed for ${tour.title}! Check your email for details.`,
                    error: "Failed to create booking. Please try again.",
                }
            );

            onClose();
            // Navigate to My Bookings page
            setTimeout(() => {
                window.location.href = "/my-bookings";
            }, 1000);
        } catch (error) {
            console.error("Direct booking error:", error);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user || !user.token) {
            showToast.warning("Please login to book a tour");
            return;
        }

        // Validate form
        if (!formData.name || !formData.email || !formData.phone) {
            showToast.warning("Please fill all fields");
            return;
        }

        if (formData.numberOfGuests < 1 || formData.numberOfGuests > tour.availableSlots) {
            showToast.warning(
                `Number of guests must be between 1 and ${tour.availableSlots}`
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
            showToast.success("Order created. Please proceed with payment.");
        } catch (error) {
            console.error("Order creation error:", error);
            showToast.error(error || "Failed to create order");
        }
    };

    const handleMockPayment = async () => {
        if (!order) {
            showToast.error("Please create order first");
            return;
        }

        const mockPaymentPromise = async () => {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create mock payment response
            const mockPaymentResponse = {
                razorpay_order_id: order.orderId,
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                razorpay_signature: `mock_signature_${Date.now()}`
            };

            // Verify mock payment on backend
            return dispatch(
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
        };

        try {
            await showToast.promise(
                mockPaymentPromise(),
                {
                    pending: "Processing mock payment...",
                    success: `🎉 Mock payment successful! Booking confirmed for ${tour.title}.`,
                    error: "Mock payment failed. Please try again.",
                }
            );

            dispatch(clearOrder());
            onClose();
            // Navigate to My Bookings page
            setTimeout(() => {
                window.location.href = "/my-bookings";
            }, 1000);
        } catch (error) {
            console.error("Mock payment error:", error);
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
            showToast.error(
                "Payment gateway not configured. Please contact administrator.",
                { autoClose: 8000 }
            );
            return;
        }

        try {
            // Load Razorpay script
            await loadRazorpay();

            if (!window.Razorpay) {
                showToast.error("Failed to load Razorpay payment gateway");
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
                            showToast.error("Invalid payment response. Please contact support.");
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

                        showToast.booking.success(tour.title);
                        dispatch(clearOrder());
                        onClose();
                        // Navigate to My Bookings page
                        setTimeout(() => {
                            window.location.href = "/my-bookings";
                        }, 1000);
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        showToast.error(error || "Payment verification failed");
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
                        showToast.info("Payment cancelled");
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
                
                showToast.error(`Payment failed: ${errorMsg}`, { autoClose: 8000 });
            });

            // Handle payment errors
            razorpay.on('payment.authorized', function(response) {
                console.log("Payment authorized:", response);
            });

            razorpay.open();
        } catch (error) {
            console.error("Razorpay initialization error:", error);
            showToast.error("Failed to load payment gateway. Please try again.");
        }
    };

    if (!isOpen) return null;

    const totalAmount = tour.price * formData.numberOfGuests;

    return (
        <div className="modal-backdrop flex items-center justify-center p-4">
            <div className="modal-content max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Header */}
                <div className="card-header bg-slate-900 text-white rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Book Your Tour</h2>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white text-2xl font-light transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="card-body space-y-6">
                    {/* Tour Info */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3">
                            {tour.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-500">📍</span>
                                <span className="text-slate-700">{tour.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-500">💰</span>
                                <span className="font-medium text-slate-900">
                                    ₹{tour.price.toLocaleString("en-IN")} per person
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-500">👥</span>
                                <span className="text-slate-700">{tour.availableSlots} slots available</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    {!order ? (
                        <form onSubmit={bookingType === "direct" ? handleDirectBooking : handleCreateOrder} className="space-y-6">
                            {/* Booking Type Selection */}
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                                    Choose Your Booking Method
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            name="bookingType"
                                            value="direct"
                                            checked={bookingType === "direct"}
                                            onChange={(e) => setBookingType(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            bookingType === "direct" 
                                                ? 'border-emerald-500 bg-emerald-50' 
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 ${
                                                    bookingType === "direct" 
                                                        ? 'border-emerald-500 bg-emerald-500' 
                                                        : 'border-slate-300'
                                                }`}>
                                                    {bookingType === "direct" && (
                                                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-900 block">
                                                        ✅ Book Now (Free)
                                                    </span>
                                                    <span className="text-sm text-slate-600">
                                                        No payment required
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            name="bookingType"
                                            value="payment"
                                            checked={bookingType === "payment"}
                                            onChange={(e) => setBookingType(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            bookingType === "payment" 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-4 h-4 rounded-full border-2 ${
                                                    bookingType === "payment" 
                                                        ? 'border-blue-500 bg-blue-500' 
                                                        : 'border-slate-300'
                                                }`}>
                                                    {bookingType === "payment" && (
                                                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-900 block">
                                                        💳 Pay with Card (Test)
                                                    </span>
                                                    <span className="text-sm text-slate-600">
                                                        Demo payment mode
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                
                                {bookingType === "payment" && (
                                    <div className="mt-4 space-y-3">
                                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    id="mockPayment"
                                                    checked={useMockPayment}
                                                    onChange={(e) => setUseMockPayment(e.target.checked)}
                                                    className="mr-2 text-emerald-600 focus-ring"
                                                />
                                                <label htmlFor="mockPayment" className="text-sm font-medium text-emerald-900">
                                                    🎭 Use Mock Payment (Recommended)
                                                </label>
                                            </div>
                                            <p className="text-xs text-emerald-800">
                                                Simulates payment without real gateway. Perfect for testing!
                                            </p>
                                        </div>
                                        
                                        {!useMockPayment && (
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-900 font-medium mb-2">
                                                    🧪 Real Razorpay Test Mode
                                                </p>
                                                <div className="text-xs text-blue-800 space-y-1">
                                                    <p><strong>Test Cards:</strong></p>
                                                    <p>• Mastercard: <code className="bg-blue-200 px-1 rounded">5555 5555 5555 4444</code></p>
                                                    <p>• Visa India: <code className="bg-blue-200 px-1 rounded">4000 0035 6000 0008</code></p>
                                                    <p>• CVV: <code className="bg-blue-200 px-1 rounded">123</code>, Expiry: <code className="bg-blue-200 px-1 rounded">12/25</code></p>
                                                    <p><strong>UPI:</strong> <code className="bg-blue-200 px-1 rounded">success@razorpay</code></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Number of Guests *
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfGuests"
                                        min="1"
                                        max={tour.availableSlots}
                                        value={formData.numberOfGuests}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-slate-700">
                                        Total Amount:
                                    </span>
                                    <span className="text-2xl font-bold text-slate-900">
                                        ₹{totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || orderLoading}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    {loading || orderLoading ? (
                                        <>
                                            <div className="loading-spinner w-4 h-4"></div>
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
                        <div className="space-y-6">
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                                <p className="text-emerald-800 font-medium">
                                    Order created successfully! Click below to proceed with payment.
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-semibold text-slate-700">
                                        Amount to Pay:
                                    </span>
                                    <span className="text-2xl font-bold text-slate-900">
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
                                    className="btn-secondary flex-1"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={useMockPayment ? handleMockPayment : handlePayment}
                                    disabled={loading}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner w-4 h-4"></div>
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

