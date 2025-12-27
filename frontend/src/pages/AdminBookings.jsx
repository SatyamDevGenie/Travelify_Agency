import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import {
    fetchAllBookings,
    confirmBooking,
    cancelBooking,
} from "../features/booking/bookingSlice";
import RejectBookingModal from "../components/RejectBookingModal";
import EmailLogViewer from "../components/EmailLogViewer";

const AdminBookings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { allBookings, loading, error } = useSelector((state) => state.booking);
    
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (!user.isAdmin) {
            navigate("/");
            showToast.error("Access denied. Admin privileges required.");
            return;
        }
        dispatch(fetchAllBookings());
    }, [dispatch, user, navigate]);

    const handleConfirm = async (bookingId) => {
        if (window.confirm("Are you sure you want to confirm this booking?")) {
            try {
                const result = await dispatch(confirmBooking(bookingId)).unwrap();
                showToast.admin.bookingConfirmed(result.guestDetails?.name || "Guest");
                dispatch(fetchAllBookings()); // Refresh list
            } catch (error) {
                showToast.error(error || "Failed to confirm booking");
            }
        }
    };

    const handleCancel = (booking) => {
        setSelectedBooking(booking);
        setIsRejectModalOpen(true);
    };

    const handleRejectBooking = async (bookingId, rejectionReason) => {
        try {
            const result = await dispatch(cancelBooking({ bookingId, rejectionReason })).unwrap();
            showToast.admin.bookingRejected(result.guestDetails?.name || "Guest");
            dispatch(fetchAllBookings()); // Refresh list
        } catch (error) {
            showToast.error(error || "Failed to reject booking");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-responsive">
                <div className="flex items-center space-x-3">
                    <div className="loading-spinner"></div>
                    <p className="text-heading text-slate-600">Loading bookings...</p>
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
                        All Bookings Management
                    </h1>
                    <p className="page-subtitle">
                        Manage and review all tour bookings
                    </p>
                    <div className="mt-2">
                        <span className="badge-info">
                            Total Bookings: {allBookings.length}
                        </span>
                    </div>
                </div>

                {allBookings.length === 0 ? (
                    <div className="card text-center p-responsive">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-heading mb-3">
                            No Bookings Yet
                        </h2>
                        <p className="text-body text-slate-600">
                            No bookings have been made yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {allBookings.map((booking) => (
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
                                            <h3 className="text-body font-semibold mb-3">Guest Information</h3>
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
                                                    <p className="text-muted">User</p>
                                                    <p className="text-body font-medium break-all">
                                                        {booking.user?.name} ({booking.user?.email})
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
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted">Payment ID</p>
                                                    <p className="text-caption break-all">
                                                        {booking.razorpayPaymentId || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Actions */}
                                        <div className="divider"></div>
                                        <div className="flex flex-wrap gap-3">
                                            {booking.bookingStatus === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleConfirm(booking._id)}
                                                        className="btn-success"
                                                    >
                                                        ✅ Confirm Booking
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(booking)}
                                                        className="btn-danger"
                                                    >
                                                        ❌ Reject Booking
                                                    </button>
                                                </>
                                            )}
                                            {booking.bookingStatus === "confirmed" && (
                                                <button
                                                    onClick={() => handleCancel(booking)}
                                                    className="btn-danger"
                                                >
                                                    ❌ Reject Booking
                                                </button>
                                            )}
                                            {booking.bookingStatus === "cancelled" && (
                                                <div className="w-full">
                                                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                                        <p className="text-body font-medium text-red-800 mb-2">
                                                            This booking has been cancelled
                                                        </p>
                                                        {booking.rejectionReason && (
                                                            <p className="text-muted text-red-600">
                                                                Reason: {booking.rejectionReason}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="mt-3">
                                                        <EmailLogViewer booking={booking} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            <RejectBookingModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onReject={handleRejectBooking}
                booking={selectedBooking}
            />
        </div>
    );
};

export default AdminBookings;


