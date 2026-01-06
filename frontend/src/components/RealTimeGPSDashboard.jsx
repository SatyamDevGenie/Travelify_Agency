import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaLocationArrow, FaUsers, FaRoute, FaMapMarkerAlt, FaClock, FaSync } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRealTimeGPS } from "../hooks/useRealTimeGPS";
import LiveGPSMap from "./LiveGPSMap";

const RealTimeGPSDashboard = ({ tour }) => {
    const { user } = useSelector((state) => state.auth);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const {
        userLocation,
        isTracking,
        connectedUsers,
        guideLocation,
        error,
        startTracking,
        stopTracking,
        getDistanceToTour,
        getDistanceToUser
    } = useRealTimeGPS(tour?._id, user?._id);

    const formatDistance = (distance) => {
        if (!distance) return "N/A";
        if (distance < 1) {
            return `${Math.round(distance * 1000)}m`;
        }
        return `${distance.toFixed(1)}km`;
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const getLocationAccuracy = (accuracy) => {
        if (accuracy < 10) return { text: "High", color: "text-green-600" };
        if (accuracy < 50) return { text: "Medium", color: "text-yellow-600" };
        return { text: "Low", color: "text-red-600" };
    };

    const distanceToTour = tour?.gpsLocation?.coordinates ? 
        getDistanceToTour(tour.gpsLocation.coordinates) : null;

    return (
        <div className="space-y-6">
            {/* GPS Status Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center">
                        <FaLocationArrow className="mr-3" />
                        Real-Time GPS Dashboard
                    </h2>
                    
                    <div className="flex items-center space-x-4">
                        {isTracking && (
                            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">LIVE</span>
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                            <FaUsers />
                            <span className="text-sm font-medium">{connectedUsers.length + 1} Online</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <FaMapMarkerAlt />
                            <span className="font-medium">Distance to Tour</span>
                        </div>
                        <div className="text-2xl font-bold">
                            {distanceToTour ? formatDistance(distanceToTour) : "N/A"}
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <FaClock />
                            <span className="font-medium">Last Update</span>
                        </div>
                        <div className="text-lg font-bold">
                            {userLocation ? formatTime(userLocation.timestamp) : "N/A"}
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <FaSync />
                            <span className="font-medium">GPS Accuracy</span>
                        </div>
                        <div className={`text-lg font-bold ${userLocation ? getLocationAccuracy(userLocation.accuracy).color : 'text-gray-300'}`}>
                            {userLocation ? getLocationAccuracy(userLocation.accuracy).text : "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            {/* GPS Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">GPS Controls</h3>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {!isTracking ? (
                        <button
                            onClick={startTracking}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaLocationArrow />
                            <span>Start Real-Time Tracking</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopTracking}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaSync />
                            <span>Stop Tracking</span>
                        </button>
                    )}

                    {userLocation && tour?.gpsLocation?.coordinates && (
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${tour.gpsLocation.coordinates.latitude},${tour.gpsLocation.coordinates.longitude}`, '_blank')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaRoute />
                            <span>Navigate Now</span>
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            <strong>GPS Error:</strong> {error}
                        </p>
                    </div>
                )}
            </div>

            {/* Connected Users */}
            {connectedUsers.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FaUsers className="mr-2" />
                        Other Travelers ({connectedUsers.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {connectedUsers.map((connectedUser, index) => (
                            <motion.div
                                key={connectedUser.userId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => setSelectedUser(connectedUser)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">
                                        Traveler {index + 1}
                                    </span>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </div>
                                
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div>Distance: {formatDistance(getDistanceToUser(connectedUser.location))}</div>
                                    <div>Updated: {formatTime(connectedUser.timestamp)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tour Guide Location */}
            {guideLocation && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-green-600" />
                        Tour Guide Location
                    </h3>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-900">Guide is Live</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className="text-sm text-green-700 space-y-1">
                            <div>Location: {guideLocation.location.lat.toFixed(6)}, {guideLocation.location.lng.toFixed(6)}</div>
                            <div>Last Update: {formatTime(guideLocation.timestamp)}</div>
                            {userLocation && (
                                <div>Distance from you: {formatDistance(getDistanceToUser(guideLocation.location))}</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Live GPS Map */}
            <LiveGPSMap tour={tour} showUserLocation={true} />

            {/* Location Details */}
            {userLocation && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Location Details</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Latitude:</span>
                            <span className="ml-2 text-gray-900">{userLocation.lat.toFixed(6)}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Longitude:</span>
                            <span className="ml-2 text-gray-900">{userLocation.lng.toFixed(6)}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Accuracy:</span>
                            <span className="ml-2 text-gray-900">±{Math.round(userLocation.accuracy)}m</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Last Updated:</span>
                            <span className="ml-2 text-gray-900">{formatTime(userLocation.timestamp)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealTimeGPSDashboard;