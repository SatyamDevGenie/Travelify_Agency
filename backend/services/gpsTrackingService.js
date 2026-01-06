import { Server } from "socket.io";

let io;

// Initialize Socket.IO for real-time GPS tracking
export const initializeGPSTracking = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔗 User connected for GPS tracking: ${socket.id}`);

        // Join tour-specific room for location updates
        socket.on('join-tour', (tourId) => {
            socket.join(`tour-${tourId}`);
            console.log(`📍 User ${socket.id} joined tour ${tourId} GPS tracking`);
        });

        // Handle user location updates
        socket.on('location-update', (data) => {
            const { tourId, location, userId } = data;
            
            // Broadcast location to all users in the same tour
            socket.to(`tour-${tourId}`).emit('user-location-update', {
                userId,
                location,
                timestamp: new Date()
            });

            console.log(`📍 Location update from ${userId} in tour ${tourId}:`, location);
        });

        // Handle tour guide location updates (for live tour tracking)
        socket.on('guide-location-update', (data) => {
            const { tourId, location, guideId } = data;
            
            // Broadcast guide location to all tour participants
            io.to(`tour-${tourId}`).emit('guide-location-update', {
                guideId,
                location,
                timestamp: new Date()
            });

            console.log(`🚌 Guide location update for tour ${tourId}:`, location);
        });

        // Leave tour room
        socket.on('leave-tour', (tourId) => {
            socket.leave(`tour-${tourId}`);
            console.log(`📍 User ${socket.id} left tour ${tourId} GPS tracking`);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected from GPS tracking: ${socket.id}`);
        });
    });

    return io;
};

// Broadcast location update to specific tour
export const broadcastLocationUpdate = (tourId, locationData) => {
    if (io) {
        io.to(`tour-${tourId}`).emit('location-broadcast', locationData);
    }
};

// Get connected users count for a tour
export const getTourParticipants = (tourId) => {
    if (io) {
        const room = io.sockets.adapter.rooms.get(`tour-${tourId}`);
        return room ? room.size : 0;
    }
    return 0;
};