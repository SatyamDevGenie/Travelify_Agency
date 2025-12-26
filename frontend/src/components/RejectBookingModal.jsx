import { useState } from "react";

const RejectBookingModal = ({ isOpen, onClose, onReject, booking }) => {
    const [rejectionReason, setRejectionReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const predefinedReasons = [
        "Slots are not available, better luck next time. Thank you for your time.",
        "Tour has been cancelled due to weather conditions.",
        "Insufficient number of participants for this tour.",
        "Tour guide is not available on the selected date.",
        "Technical issues with the booking system.",
        "Custom reason" // This will show the custom input
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const finalReason = rejectionReason === "Custom reason" ? customReason : rejectionReason;
        
        if (!finalReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onReject(booking._id, finalReason);
            onClose();
            setRejectionReason("");
            setCustomReason("");
        } catch (error) {
            console.error("Error rejecting booking:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setRejectionReason("");
        setCustomReason("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-red-600 text-white p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Reject Booking</h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:text-gray-200 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Booking Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Booking Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Tour:</span>{" "}
                                <span className="font-medium">{booking?.tour?.title}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Guest:</span>{" "}
                                <span className="font-medium">{booking?.guestDetails?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Email:</span>{" "}
                                <span className="font-medium">{booking?.guestDetails?.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Guests:</span>{" "}
                                <span className="font-medium">{booking?.numberOfGuests}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Rejection Reason *
                            </label>
                            <div className="space-y-2">
                                {predefinedReasons.map((reason, index) => (
                                    <label key={index} className="flex items-start">
                                        <input
                                            type="radio"
                                            name="rejectionReason"
                                            value={reason}
                                            checked={rejectionReason === reason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            className="mr-3 mt-1 text-red-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {reason}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Custom Reason Input */}
                        {rejectionReason === "Custom reason" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Custom Reason *
                                </label>
                                <textarea
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    placeholder="Please provide a detailed reason for rejection..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    rows="4"
                                    required
                                />
                            </div>
                        )}

                        {/* Preview */}
                        {rejectionReason && rejectionReason !== "Custom reason" && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <p className="text-sm text-red-800">
                                    <strong>Preview of rejection message:</strong>
                                </p>
                                <p className="text-sm text-red-700 mt-2 italic">
                                    "{rejectionReason}"
                                </p>
                            </div>
                        )}

                        {rejectionReason === "Custom reason" && customReason && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <p className="text-sm text-red-800">
                                    <strong>Preview of rejection message:</strong>
                                </p>
                                <p className="text-sm text-red-700 mt-2 italic">
                                    "{customReason}"
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !rejectionReason || (rejectionReason === "Custom reason" && !customReason.trim())}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Rejecting...
                                    </>
                                ) : (
                                    <>
                                        ❌ Reject Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RejectBookingModal;