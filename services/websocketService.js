import { io } from './index.js';

export const emitLocationUpdate = (helpId, latitude, longitude) => {
    io.to(`help_${helpId}`).emit('location-updated', {
        helpId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
    });
};