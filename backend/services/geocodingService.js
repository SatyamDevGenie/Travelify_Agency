import axios from 'axios';

/**
 * Geocoding service using OpenStreetMap Nominatim API (Free)
 * Alternative to Google Maps Geocoding API
 */

export const getCoordinatesFromLocation = async (locationName) => {
    try {
        // Clean and format the location name
        const cleanLocation = locationName.trim().replace(/\s+/g, ' ');
        
        // Use Nominatim API (OpenStreetMap) - completely free
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: cleanLocation,
                format: 'json',
                limit: 1,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'Travelify-App/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            
            return {
                success: true,
                data: {
                    name: result.display_name,
                    coordinates: {
                        latitude: parseFloat(result.lat),
                        longitude: parseFloat(result.lon)
                    },
                    address: result.display_name,
                    city: result.address?.city || result.address?.town || result.address?.village || '',
                    country: result.address?.country || '',
                    zipCode: result.address?.postcode || ''
                }
            };
        } else {
            return {
                success: false,
                message: 'Location not found'
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return {
            success: false,
            message: 'Error fetching location data',
            error: error.message
        };
    }
};

/**
 * Alternative: Google Maps Geocoding API (requires API key but more accurate)
 * Uncomment and use this if you have Google Maps API key
 */
/*
export const getCoordinatesFromLocationGoogle = async (locationName) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: locationName,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const result = response.data.results[0];
            
            return {
                success: true,
                data: {
                    name: result.formatted_address,
                    coordinates: {
                        latitude: result.geometry.location.lat,
                        longitude: result.geometry.location.lng
                    },
                    address: result.formatted_address,
                    city: result.address_components.find(c => c.types.includes('locality'))?.long_name || '',
                    country: result.address_components.find(c => c.types.includes('country'))?.long_name || '',
                    zipCode: result.address_components.find(c => c.types.includes('postal_code'))?.long_name || ''
                }
            };
        } else {
            return {
                success: false,
                message: 'Location not found'
            };
        }
    } catch (error) {
        console.error('Google Geocoding error:', error);
        return {
            success: false,
            message: 'Error fetching location data',
            error: error.message
        };
    }
};
*/

/**
 * Reverse geocoding - get address from coordinates
 */
export const getLocationFromCoordinates = async (latitude, longitude) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat: latitude,
                lon: longitude,
                format: 'json',
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'Travelify-App/1.0'
            }
        });

        if (response.data) {
            const result = response.data;
            
            return {
                success: true,
                data: {
                    name: result.display_name,
                    address: result.display_name,
                    city: result.address?.city || result.address?.town || result.address?.village || '',
                    country: result.address?.country || '',
                    zipCode: result.address?.postcode || ''
                }
            };
        } else {
            return {
                success: false,
                message: 'Address not found'
            };
        }
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return {
            success: false,
            message: 'Error fetching address data',
            error: error.message
        };
    }
};