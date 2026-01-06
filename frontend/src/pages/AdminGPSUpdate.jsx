import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaSync, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { showToast } from "../utils/toast";

const AdminGPSUpdate = () => {
    const { user } = useSelector((state) => state.auth);
    const [updating, setUpdating] = useState(false);
    const [updateResult, setUpdateResult] = useState(null);

    // Check if user is admin
    if (!user || !user.isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600">You need admin privileges to access this page</p>
                </div>
            </div>
        );
    }

    const handleUpdateAllTours = async () => {
        if (!window.confirm("This will update GPS coordinates for all tours. This may take a few minutes. Continue?")) {
            return;
        }

        setUpdating(true);
        setUpdateResult(null);

        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            const token = userData?.token;

            const response = await axios.post("/api/tours/update-all-gps", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUpdateResult(response.data.data);
                showToast.success(`GPS update completed! Updated ${response.data.data.updated} tours`);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error updating GPS coordinates";
            showToast.error(message);
            console.error("GPS update error:", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-fluid max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaMapMarkerAlt className="text-2xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">GPS Coordinates Update</h1>
                            <p className="text-gray-600">Update GPS coordinates for all tours</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important Information</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• This will fetch GPS coordinates for all tours based on their location names</li>
                            <li>• The process uses OpenStreetMap's free geocoding service</li>
                            <li>• It may take several minutes to complete</li>
                            <li>• Tours with existing GPS data will be skipped</li>
                            <li>• Some locations may not be found and will be skipped</li>
                        </ul>
                    </div>
                </div>

                {/* Update Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Update GPS Coordinates</h2>

                    {/* Update Button */}
                    <div className="text-center mb-8">
                        <button
                            onClick={handleUpdateAllTours}
                            disabled={updating}
                            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto ${
                                updating
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {updating ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    <span>Updating GPS Coordinates...</span>
                                </>
                            ) : (
                                <>
                                    <FaSync />
                                    <span>Update All Tours GPS</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {updateResult && (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Results</h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                    <FaCheck className="text-2xl text-green-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-green-800">{updateResult.updated}</div>
                                    <div className="text-sm text-green-600">Successfully Updated</div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                    <FaTimes className="text-2xl text-red-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-red-800">{updateResult.failed}</div>
                                    <div className="text-sm text-red-600">Failed to Update</div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                    <FaMapMarkerAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-blue-800">{updateResult.total}</div>
                                    <div className="text-sm text-blue-600">Total Processed</div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-white rounded-lg border">
                                <p className="text-sm text-gray-600">
                                    <strong>Success Rate:</strong> {
                                        updateResult.total > 0 
                                            ? Math.round((updateResult.updated / updateResult.total) * 100)
                                            : 0
                                    }% of tours were successfully updated with GPS coordinates.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800 mb-2">📍 How it works:</h3>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                            <li>The system will find all tours without GPS coordinates</li>
                            <li>For each tour, it will search for the location using OpenStreetMap</li>
                            <li>If found, it will save the latitude, longitude, and address details</li>
                            <li>The GPS data will then be displayed on tour detail pages with interactive maps</li>
                            <li>Users can get directions and view the exact location of each tour</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGPSUpdate;