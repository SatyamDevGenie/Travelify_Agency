import React from "react";
import { FaMapMarkerAlt, FaMapPin } from "react-icons/fa";

const GPSIndicator = ({ tour, size = "sm" }) => {
    const hasGPS = tour?.gpsLocation?.coordinates?.latitude && tour?.gpsLocation?.coordinates?.longitude;
    
    const sizeClasses = {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-2"
    };

    const iconSizes = {
        sm: "text-xs",
        md: "text-sm", 
        lg: "text-base"
    };

    if (hasGPS) {
        return (
            <span className={`inline-flex items-center space-x-1 bg-green-100 text-green-800 rounded-full font-medium ${sizeClasses[size]}`}>
                <FaMapMarkerAlt className={iconSizes[size]} />
                <span>GPS Available</span>
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center space-x-1 bg-gray-100 text-gray-600 rounded-full font-medium ${sizeClasses[size]}`}>
            <FaMapPin className={iconSizes[size]} />
            <span>Location Only</span>
        </span>
    );
};

export default GPSIndicator;