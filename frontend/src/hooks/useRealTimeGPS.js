import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { showToast } from "../utils/toast";

export const useRealTimeGPS = (tourId, userId) => {
    const [userLocation, setUserLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [guideLocation, setGuideLocation] = useState(null);
    const [error, setError] = useState(null);
    
    const socketRef = useRef(null);
    const watchIdRef = useRef(null);

    // Initialize Socket.IO connection
    useEffect(() => {
        if (tourId) {
            socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:5000");
            
            const socket = socketRef.current;

            // Join tour room for real-time updates
            socket.emit('join-tour', tourId);

            // Listen for other users' location updates
            socket.on('user-location-update', (data) => {
                setConnectedUsers(prev => {
                    const updated = prev.filter(user => user.userId !== data.userId);
                    return [...updated, data];
                });
            });

            // Listen for tour guide location updates
            socket.on('guide-location-update', (data) => {
                setGuideLocation(data);
            });

            // Handle connection events
            socket.on('connect', () => {
                console.log('🔗 Connected to GPS tracking server');
            });

            socket.on('disconnect', () => {
                console.log('🔌 Disconnected from GPS tracking server');
            });

            return () => {
                socket.emit('leave-tour', tourId);
                socket.disconnect();
            };
        }
    }, [tourId]);

    // Start real-time GPS tracking
    const startTracking = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser");
            showToast.error("GPS not supported on this device");
            return;
        }

        setIsTracking(true);
        setError(null);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
        };

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date(position.timestamp)
                };
                
                setUserLocation(location);
                
                // Broadcast location to other users
                if (socketRef.current && userId) {
                    socketRef.current.emit('location-update', {
                        tourId,
                        userId,
                        location
                    });
                }
                
                showToast.success("GPS tracking started! 📍");
            },
            (error) => {
                setError(error.message);
                setIsTracking(false);
                showToast.error(`GPS Error: ${error.message}`);
            },
            options
        );

        // Start watching position for continuous updates
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date(position.timestamp)
                };
                
                setUserLocation(location);
                
                // Broadcast updated location
                if (socketRef.current && userId) {
                    socketRef.current.emit('location-update', {
                        tourId,
                        userId,
                        location
                    });
                }
            },
            (error) => {
                console.error("GPS tracking error:", error);
                setError(error.message);
            },
            options
        );

        watchIdRef.current = watchId;
    };

    // Stop GPS tracking
    const stopTracking = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        
        setIsTracking(false);
        showToast.info("GPS tracking stopped");
    };

    // Calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Get distance to tour location
    const getDistanceToTour = (tourCoordinates) => {
        if (!userLocation || !tourCoordinates) return null;
        
        return calculateDistance(
            userLocation.lat,
            userLocation.lng,
            tourCoordinates.latitude,
            tourCoordinates.longitude
        );
    };

    // Get distance to other users
    const getDistanceToUser = (otherUserLocation) => {
        if (!userLocation || !otherUserLocation) return null;
        
        return calculateDistance(
            userLocation.lat,
            userLocation.lng,
            otherUserLocation.lat,
            otherUserLocation.lng
        );
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    return {
        userLocation,
        isTracking,
        connectedUsers,
        guideLocation,
        error,
        startTracking,
        stopTracking,
        getDistanceToTour,
        getDistanceToUser,
        calculateDistance
    };
};