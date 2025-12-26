import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    fetchAllBookings,
    confirmBooking,
    cancelBooking,
} from "../features/booking/bookingSlice";
import RejectBookingModal from "../components/RejectBookingModal";

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
            toast.error("Access denied. Admin only.", { theme: "colored" });
            return;
        }
        dispatch(fetchAllBookings());
    }, [dispatch, user, navigate]);

    const handleConfirm = async (bookingId) => {
        if (window.confirm("Are you sure you want to confirm this booking?")) {
            try {
                await dispatch(confirmBooking(bookingId)).unwrap();
                toast.success("Booking confirmed successfully!", { theme: "colored" });
                dispatch(fetchAllBookings()); // Refresh list
            } catch (error) {
                toast.error(error || "Failed to confirm booking", { theme: "colored" });
            }
        }
    };

    const handleCancel = (booking) => {
        setSelectedBooking(booking);
        setIsRejectModalOpen(true);
    };

    const handleRejectBooking = async (bookingId, rejectionReason) => {
        try {
            await dispatch(cancelBooking({ bookingId, rejectionReason })).unwrap();
            toast.success("Booking rejected successfully!", { theme: "colored" });
            dispatch(fetchAllBookings()); // Refresh list
        } catch (error) {
            toast.error(error || "Failed to reject booking", { theme: "colored" });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            confirmed: "bg-green-100 text-green-800 border-green-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return badges[status] || badges.pending;
    };

    const getPaymentBadge = (status) => {
        const badges = {
            pending: "bg-gray-100 text-gray-800 border-gray-200",
            completed: "bg-blue-100 text-blue-800 border-blue-200",
            failed: "bg-red-100 text-red-800 border-red-200",
            refunded: "bg-purple-100 text-purple-800 border-purple-200",
        };
        return badges[status] || badges.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-indigo-600">Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        All Bookings Management
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Manage and review all tour bookings
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Total Bookings: {allBookings.length}
                    </p>
                </div>

                {allBookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            No Bookings Yet
                        </h2>
                        <p className="text-gray-600">
                            No bookings have been made yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {allBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="md:flex">
                                    {/* Tour Image */}
                                    <div className="md:w-1/3">
                                        <img
                                            src={booking.tour.image}
                                            alt={booking.tour.title}
                                            className="w-full h-64 md:h-full object-cover"
                                        />
                                    </div>

                                    {/* Booking Details */}
                                    <div className="md:w-2/3 p-6">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                                                    booking.bookingStatus
                                                )}`}
                                            >
                                                {booking.bookingStatus.toUpperCase()}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentBadge(
                                                    booking.paymentStatus
                                                )}`}
                                            >
                                                Payment: {booking.paymentStatus.toUpperCase()}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            {booking.tour.title}
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-semibold text-gray-800">
                                                    📍 {booking.tour.location}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Category</p>
                                                <p className="font-semibold text-gray-800">
                                                    {booking.tour.category} - {booking.tour.subcategory}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Number of Guests</p>
                                                <p className="font-semibold text-gray-800">
                                                    👥 {booking.numberOfGuests}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="font-semibold text-indigo-600 text-lg">
                                                    ₹{booking.totalAmount.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 mb-4">
                                            <h3 className="font-semibold text-gray-800 mb-2">Guest Information</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Guest Name</p>
                                                    <p className="font-medium text-gray-800">
                                                        {booking.guestDetails.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Email</p>
                                                    <p className="font-medium text-gray-800">
                                                        {booking.guestDetails.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Phone</p>
                                                    <p className="font-medium text-gray-800">
                                                        {booking.guestDetails.phone}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">User</p>
                                                    <p className="font-medium text-gray-800">
                                                        {booking.user?.name} ({booking.user?.email})
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Booking Date</p>
                                                    <p className="font-medium text-gray-800">
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
                                                    <p className="text-gray-500">Payment ID</p>
                                                    <p className="font-medium text-gray-800 text-xs break-all">
                                                        {booking.razorpayPaymentId || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Actions */}
                                        <div className="border-t pt-4 flex flex-wrap gap-3">
                                            {booking.bookingStatus === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleConfirm(booking._id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                                                    >
                                                        ✅ Confirm Booking
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(booking)}
                                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                                                    >
                                                        ❌ Reject Booking
                                                    </button>
                                                </>
                                            )}
                                            {booking.bookingStatus === "confirmed" && (
                                                <button
                                                    onClick={() => handleCancel(booking)}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                                                >
                                                    ❌ Reject Booking
                                                </button>
                                            )}
                                            {booking.bookingStatus === "cancelled" && (
                                                <p className="text-red-600 font-medium">
                                                    This booking has been cancelled
                                                </p>
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


