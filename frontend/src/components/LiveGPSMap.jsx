import React, { useState, useEffect, useRef } from "react";
import { FaLocationArrow, FaExpand, FaTimes, FaMapMarkerAlt, FaRoute, FaSync } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../utils/toast";

const LiveGPSMap = ({ tour, showUserLocation = true }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [distance, setDistance] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const mapRef = useRef(null);

    // Check if GPS location data exists for tour
    const hasGPSData = tour?.gpsLocation?.coordinates?.latitude && tour?.gpsLocation?.coordinates?.longitude;
    
    useEffect(() => {
        if (hasGPSData) {
            setMapCenter({
                lat: tour.gpsLocation.coordinates.latitude,
                lng: tour.gpsLocation.coordinates.longitude
            });
        }
    }, [tour, hasGPSData]);

    // Calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in kilometers
        return distance;
    };

    // Start real-time location tracking
    const startTracking = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser");
            showToast.error("GPS not supported on this device");
            return;
        }

        setIsTracking(true);
        setLocationError(null);
        showToast.info("Starting GPS tracking...");

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 1000
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date(position.timestamp)
                };
                
                setUserLocation(newLocation);
                
                // Calculate distance to tour if GPS data available
                if (hasGPSData) {
                    const dist = calculateDistance(
                        newLocation.lat,
                        newLocation.lng,
                        tour.gpsLocation.coordinates.latitude,
                        tour.gpsLocation.coordinates.longitude
                    );
                    setDistance(dist);
                }
                
                showToast.success("GPS location found! 📍");
            },
            (error) => {
                setLocationError(error.message);
                setIsTracking(false);
                showToast.error(`GPS Error: ${error.message}`);
            },
            options
        );

        // Start watching position for real-time updates
        const id = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date(position.timestamp)
                };
                
                setUserLocation(newLocation);
                
                // Update distance
                if (hasGPSData) {
                    const dist = calculateDistance(
                        newLocation.lat,
                        newLocation.lng,
                        tour.gpsLocation.coordinates.latitude,
                        tour.gpsLocation.coordinates.longitude
                    );
                    setDistance(dist);
                }
            },
            (error) => {
                console.error("GPS tracking error:", error);
                setLocationError(error.message);
            },
            options
        );

        setWatchId(id);
    };

    // Stop real-time location tracking
    const stopTracking = () => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setIsTracking(false);
        showToast.info("GPS tracking stopped");
    };

    // Center map on user location
    const centerOnUser = () => {
        if (userLocation) {
            setMapCenter(userLocation);
            showToast.success("Centered on your location");
        }
    };

    // Center map on tour location
    const centerOnTour = () => {
        if (hasGPSData) {
            setMapCenter({
                lat: tour.gpsLocation.coordinates.latitude,
                lng: tour.gpsLocation.coordinates.longitude
            });
            showToast.success("Centered on tour location");
        }
    };

    // Generate map URL with markers
    const generateMapUrl = (isFullSize = false) => {
        if (!hasGPSData) return null;

        const tourLat = tour.gpsLocation.coordinates.latitude;
        const tourLng = tour.gpsLocation.coordinates.longitude;
        
        let bbox, markers = "";
        
        if (userLocation) {
            // Show both user and tour location
            const minLat = Math.min(userLocation.lat, tourLat) - 0.01;
            const maxLat = Math.max(userLocation.lat, tourLat) + 0.01;
            const minLng = Math.min(userLocation.lng, tourLng) - 0.01;
            const maxLng = Math.max(userLocation.lng, tourLng) + 0.01;
            
            bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
            markers = `&marker=${tourLat},${tourLng}&marker=${userLocation.lat},${userLocation.lng}`;
        } else {
            // Show only tour location
            const center = mapCenter || { lat: tourLat, lng: tourLng };
            const offset = 0.01;
            bbox = `${center.lng - offset},${center.lat - offset},${center.lng + offset},${center.lat + offset}`;
            markers = `&marker=${tourLat},${tourLng}`;
        }

        return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${markers}`;
    };

    const formatDistance = (dist) => {
        if (dist < 1) {
            return `${Math.round(dist * 1000)}m away`;
        }
        return `${dist.toFixed(1)}km away`;
    };

    if (!hasGPSData) {
        return (
            <div className="bg-gray-100 rounded-xl p-8 text-center">
                <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Live GPS Map</h3>
                <p className="text-gray-500 mb-4">
                    GPS coordinates not available for this tour location
                </p>
            </div>
        );
    }

    const MapContent = ({ isFullSize = false }) => (
        <div className={`relative ${isFullSize ? 'h-full' : 'h-64 sm:h-80'} bg-gray-200 rounded-xl overflow-hidden`}>
            <iframe
                ref={mapRef}
                src={generateMapUrl(isFullSize)}
                className="w-full h-full border-0"
                title={`Live GPS Map - ${tour.title}`}
                loading="lazy"
            />
            
            {/* Map Controls */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2">
                {!isFullSize && (
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-md transition-colors"
                        title="Fullscreen"
                    >
                        <FaExpand className="text-sm" />
                    </button>
                )}
                
                {userLocation && (
                    <button
                        onClick={centerOnUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-colors"
                        title="Center on my location"
                    >
                        <FaLocationArrow className="text-sm" />
                    </button>
                )}
                
                <button
                    onClick={centerOnTour}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-md transition-colors"
                    title="Center on tour location"
                >
                    <FaMapMarkerAlt className="text-sm" />
                </button>
            </div>

            {/* Live Status Indicator */}
            {isTracking && (
                <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
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
                        <FaLocationArrow className="text-blue-500 mr-3" />
                        Live GPS Map
                    </h3>
                    
                    {/* GPS Controls */}
                    <div className="flex space-x-2">
                        {!isTracking ? (
                            <button
                                onClick={startTracking}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <FaLocationArrow />
                                <span>Start GPS</span>
                            </button>
                        ) : (
                            <button
                                onClick={stopTracking}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <FaTimes />
                                <span>Stop GPS</span>
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Location Info */}
                <div className="space-y-2 text-gray-600">
                    <p className="font-medium">{tour.gpsLocation.name || tour.location}</p>
                    
                    {/* User Location Status */}
                    {userLocation && (
                        <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center space-x-1 text-green-600">
                                <FaLocationArrow />
                                <span>Your Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
                            </span>
                            {distance && (
                                <span className="flex items-center space-x-1 text-blue-600">
                                    <FaRoute />
                                    <span>{formatDistance(distance)}</span>
                                </span>
                            )}
                        </div>
                    )}
                    
                    {locationError && (
                        <p className="text-red-600 text-sm">GPS Error: {locationError}</p>
                    )}
                </div>
            </div>

            {/* Map */}
            <div className="p-6">
                <MapContent />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${tour.gpsLocation.coordinates.latitude},${tour.gpsLocation.coordinates.longitude}`, '_blank')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <FaRoute />
                        <span>Get Directions</span>
                    </button>
                    
                    {userLocation && (
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${tour.gpsLocation.coordinates.latitude},${tour.gpsLocation.coordinates.longitude}`, '_blank')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaLocationArrow />
                            <span>Navigate from Here</span>
                        </button>
                    )}
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
                                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                    <FaLocationArrow className="text-blue-500 mr-2" />
                                    Live GPS Map - {tour.title}
                                    {isTracking && (
                                        <span className="ml-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs">LIVE</span>
                                    )}
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

export default LiveGPSMap;