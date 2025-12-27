import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "../features/booking/bookingSlice";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { bookings, loading, error } = useSelector((state) => state.booking);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Fetch bookings when component mounts
        dispatch(fetchMyBookings());
    }, [dispatch, user, navigate]);

    // Refresh bookings when navigating to this page
    useEffect(() => {
        const handleFocus = () => {
            if (user) {
                dispatch(fetchMyBookings());
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [dispatch, user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-responsive">
                <div className="flex items-center space-x-3">
                    <div className="loading-spinner"></div>
                    <p className="text-heading text-slate-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-responsive">
                <div className="text-center">
                    <p className="text-heading text-red-600 mb-2">Error Loading Bookings</p>
                    <p className="text-body text-slate-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-responsive">
            <div className="container-fluid">
                <div className="page-header">
                    <h1 className="page-title">
                        My Bookings
                    </h1>
                    <p className="page-subtitle">
                        View all your tour bookings and their status
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <div className="card text-center p-responsive">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-heading mb-3">
                            No Bookings Yet
                        </h2>
                        <p className="text-body text-slate-600 mb-6">
                            Start exploring amazing tours and book your next adventure!
                        </p>
                        <button
                            onClick={() => navigate("/tours")}
                            className="btn-primary"
                        >
                            Browse Tours
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="card hover-lift animate-fade-in"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Tour Image */}
                                    <div className="lg:w-1/3">
                                        <img
                                            src={booking.tour.image}
                                            alt={booking.tour.title}
                                            className="w-full h-64 lg:h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-t-none"
                                        />
                                    </div>

                                    {/* Booking Details */}
                                    <div className="lg:w-2/3 card-body">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`badge-${booking.bookingStatus === 'confirmed' ? 'success' : booking.bookingStatus === 'cancelled' ? 'error' : 'warning'}`}>
                                                {booking.bookingStatus.toUpperCase()}
                                            </span>
                                            <span className={`badge-${booking.paymentStatus === 'completed' ? 'info' : booking.paymentStatus === 'failed' ? 'error' : 'neutral'}`}>
                                                Payment: {booking.paymentStatus.toUpperCase()}
                                            </span>
                                        </div>

                                        <h2 className="text-heading mb-3">
                                            {booking.tour.title}
                                        </h2>

                                        <div className="grid-responsive-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-muted">Location</p>
                                                <p className="text-body font-medium">
                                                    📍 {booking.tour.location}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted">Category</p>
                                                <p className="text-body font-medium">
                                                    {booking.tour.category} - {booking.tour.subcategory}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted">Number of Guests</p>
                                                <p className="text-body font-medium">
                                                    👥 {booking.numberOfGuests}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted">Total Amount</p>
                                                <p className="text-heading text-blue-600">
                                                    ₹{booking.totalAmount.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="divider"></div>
                                        
                                        <div className="mb-4">
                                            <div className="grid-responsive-2 gap-4">
                                                <div>
                                                    <p className="text-muted">Guest Name</p>
                                                    <p className="text-body font-medium">
                                                        {booking.guestDetails.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted">Email</p>
                                                    <p className="text-body font-medium break-all">
                                                        {booking.guestDetails.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted">Phone</p>
                                                    <p className="text-body font-medium">
                                                        {booking.guestDetails.phone}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted">Booking Date</p>
                                                    <p className="text-body font-medium">
                                                        {new Date(booking.createdAt).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Messages */}
                                        {booking.bookingStatus === "pending" && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <p className="text-body text-amber-800">
                                                    ⏳ Your booking is pending admin approval. You will receive an email
                                                    once it's confirmed.
                                                </p>
                                            </div>
                                        )}

                                        {booking.bookingStatus === "confirmed" && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                                <p className="text-body text-emerald-800">
                                                    ✅ Your booking has been confirmed! Check your email for details.
                                                </p>
                                            </div>
                                        )}

                                        {booking.bookingStatus === "cancelled" && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <p className="text-body text-red-800 mb-2">
                                                    ❌ Your booking has been cancelled.
                                                </p>
                                                {booking.rejectionReason && (
                                                    <div className="bg-red-100 border border-red-300 rounded p-3 mb-2">
                                                        <p className="text-muted text-red-700">
                                                            <strong>Reason:</strong> {booking.rejectionReason}
                                                        </p>
                                                    </div>
                                                )}
                                                <p className="text-caption text-red-600">
                                                    Refund will be processed within 5-7 business days.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;

