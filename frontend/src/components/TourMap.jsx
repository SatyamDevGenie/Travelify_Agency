import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaDirections, FaExpand, FaTimes, FaMapPin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TourMap = ({ tour }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapError, setMapError] = useState(false);

    // Check if GPS location data exists
    const hasGPSData = tour?.gpsLocation?.coordinates?.latitude && tour?.gpsLocation?.coordinates?.longitude;
    
    if (!hasGPSData) {
        return (
            <div className="bg-gray-100 rounded-xl p-8 text-center">
                <FaMapPin className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Location Map</h3>
                <p className="text-gray-500 mb-4">
                    <FaMapMarkerAlt className="inline mr-2" />
                    {tour?.location || "Location not specified"}
                </p>
                <p className="text-sm text-gray-400">
                    GPS coordinates not available for this location
                </p>
            </div>
        );
    }

    const { latitude, longitude } = tour.gpsLocation.coordinates;
    const locationName = tour.gpsLocation.name || tour.location;

    // OpenStreetMap embed URL
    const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    
    // Google Maps URLs
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    const handleGetDirections = () => {
        window.open(googleDirectionsUrl, '_blank');
    };

    const handleViewOnGoogleMaps = () => {
        window.open(googleMapsUrl, '_blank');
    };

    const MapContent = ({ isFullSize = false }) => (
        <div className={`relative ${isFullSize ? 'h-full' : 'h-64 sm:h-80'} bg-gray-200 rounded-xl overflow-hidden`}>
            {!mapError ? (
                <iframe
                    src={osmEmbedUrl}
                    className="w-full h-full border-0"
                    title={`Map of ${locationName}`}
                    onError={() => setMapError(true)}
                    loading="lazy"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                        <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Unable to load map</p>
                        <button
                            onClick={handleViewOnGoogleMaps}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            View on Google Maps
                        </button>
                    </div>
                </div>
            )}
            
            {/* Map Controls */}
            {!isFullSize && (
                <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-md transition-colors"
                        title="Fullscreen"
                    >
                        <FaExpand className="text-sm" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <FaMapMarkerAlt className="text-red-500 mr-3" />
                        Tour Location
                    </h3>
                </div>
                
                <div className="space-y-2 text-gray-600">
                    <p className="font-medium">{locationName}</p>
                    {tour.gpsLocation.city && (
                        <p className="text-sm">
                            {tour.gpsLocation.city}
                            {tour.gpsLocation.country && `, ${tour.gpsLocation.country}`}
                        </p>
                    )}
                    <p className="text-xs text-gray-500">
                        Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                </div>
            </div>

            {/* Map */}
            <div className="p-6">
                <MapContent />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                        onClick={handleGetDirections}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <FaDirections />
                        <span>Get Directions</span>
                    </button>
                    
                    <button
                        onClick={handleViewOnGoogleMaps}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <FaMapMarkerAlt />
                        <span>View on Google Maps</span>
                    </button>
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Fullscreen Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {locationName}
                                </h3>
                                <button
                                    onClick={() => setIsFullscreen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            
                            {/* Fullscreen Map */}
                            <div className="h-full p-4">
                                <MapContent isFullSize={true} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TourMap;