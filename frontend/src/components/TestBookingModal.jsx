import { useState } from "react";

const TestBookingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [bookingType, setBookingType] = useState("payment");

    const mockTour = {
        _id: "test123",
        title: "Test Tour",
        location: "Test Location",
        price: 5000,
        availableSlots: 10
    };

    if (!isOpen) {
        return (
            <div className="p-4">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Test Booking Modal
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-indigo-600 text-white p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Test Booking Modal</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-200 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
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
                            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                                <p className="text-sm text-blue-900 font-medium">
                                    🧪 <strong>TEST MODE ACTIVE</strong>
                                </p>
                                <p className="text-xs text-blue-800 mt-1">
                                    Use Indian test card: <code className="bg-blue-200 px-1 rounded">5555 5555 5555 4444</code>, 
                                    CVV: <code className="bg-blue-200 px-1 rounded">123</code>, 
                                    Expiry: <code className="bg-blue-200 px-1 rounded">12/25</code>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-center p-4 bg-gray-100 rounded">
                        <p>Current selection: <strong>{bookingType}</strong></p>
                        <p className="text-sm text-gray-600 mt-2">
                            This is a test modal to verify the booking type selection is working.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestBookingModal;