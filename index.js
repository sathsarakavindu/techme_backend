import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import userRouter from './routes/userRoutes.js';
import mongoose from 'mongoose';
import 'dotenv/config'
import vehicleRouter from './routes/vehicleRoutes.js';
import technicianRoute from './routes/technicianRoutes.js';
import helpRouter from './routes/helpRoutes.js';
import approvalRouter from './routes/approvalRoutes.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app); // Single server that handle both HTTP and WebSocket traffic.

// Configure Socket.IO with proper settings for Railway
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  // Important: Allow upgrades and set ping timeout
  allowUpgrades: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'] // Try WebSocket first, fallback to polling
});

app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","DELETE"]
}));

app.use(bodyParser.json());

const password = process.env.PASSWORD;

const mongodbURL = `mongodb+srv://tester:${password}@cluster0.3drlv9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongodbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });

app.use('/api/users', userRouter);
app.use('/api/technician', technicianRoute);
app.use('/api/vehicle', vehicleRouter);
app.use('/api/users/help', helpRouter);
app.use('/api/users/approval-help', approvalRouter);

// In the server file, update the WebSocket handling (Adds listener function as the event listener for events.)
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join a specific help request room
    socket.on('join-help-room', (helpId) => {
        socket.join(`help_${helpId}`);
        console.log(`Socket ${socket.id} joined room help_${helpId}`);
    });
    
    // Leave help request room
    socket.on('leave-help-room', (helpId) => {
        socket.leave(`help_${helpId}`);
        console.log(`Socket ${socket.id} left room help_${helpId}`);
    });
    
    // Update location handler
    socket.on('update-location', async (data) => {
        const { helpId, latitude, longitude, timestamp } = data;
        
        console.log(`📍 Location update received for ${helpId}: ${latitude}, ${longitude}`);
        
        // Validate data
        if (!helpId || typeof latitude !== 'number' || typeof longitude !== 'number') {
            console.error('Invalid location data received');
            socket.emit('location-updated', {
                type: 'location-updated',
                helpId: helpId,
                error: 'Invalid data',
                confirmed: false
            });
            return;
        }
        
        // Update MongoDB
        try {
            const MakeHelp = mongoose.model('make help');
            const result = await MakeHelp.findByIdAndUpdate(
                helpId,
                { 
                    $set: { 
                        latitude: latitude, 
                        longitude: longitude,
                        lastLocationUpdate: new Date(timestamp)
                    },
                    $push: {
                        locationHistory: {
                            latitude: latitude,
                            longitude: longitude,
                            timestamp: new Date(timestamp)
                        }
                    }
                },
                { new: true }
            );
            
            if (result) {
                console.log(`✅ Database updated for help ${helpId}`);
                // Broadcast to all clients in the room
                io.to(`help_${helpId}`).emit('location-updated', {
                    type: 'location-updated',
                    helpId: helpId,
                    latitude: latitude,
                    longitude: longitude,
                    timestamp: timestamp,
                    confirmed: true
                });
            } else {
                console.log(`❌ Help request ${helpId} not found`);
                socket.emit('location-updated', {
                    type: 'location-updated',
                    helpId: helpId,
                    error: 'Help request not found',
                    confirmed: false
                });
            }
        } catch (error) {
            console.error('Error updating location:', error);
            socket.emit('location-updated', {
                type: 'location-updated',
                helpId: helpId,
                error: 'Database error',
                confirmed: false
            });
        }
    });

    // Getting Help List
socket.on('get-help-list', async (data) => {

    try {

        const MakeHelp = mongoose.model('make help');

        const helpList = await MakeHelp.find({
            isCancelled: false,
            isCompleted: false,
            isApproved: false
        });

        socket.emit('got-help-list', {
            type: 'got-help-list',
            helpList: helpList,
            confirmed: true
        });

        console.log(`✅ Found ${helpList.length} help requests`);

    } catch (error) {

        console.error("Error getting help list:", error);

        socket.emit('got-help-list', {
            type: 'got-help-list',
            error: 'Database error',
            confirmed: false
        });
    }

});
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});


// WebSocket connection handling
// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);
    
//     // Join a specific help request room
//     socket.on('join-help-room', (helpId) => {
//         socket.join(`help_${helpId}`);
//         console.log(`Socket ${socket.id} joined room help_${helpId}`);
//     });
    
//     // Leave help request room
//     socket.on('leave-help-room', (helpId) => {
//         socket.leave(`help_${helpId}`);
//         console.log(`Socket ${socket.id} left room help_${helpId}`);
//     });
    
//     // In your socket.on('update-location') handler
// socket.on("update-location", async (data) => {
//     const { helpId, latitude, longitude } = data;

//     if (!helpId || !latitude || !longitude) {
//         console.log("❌ Invalid data received:", data);
//         return;
//     }

//     console.log(`📍 Location update received for ${helpId}: ${latitude}, ${longitude}`);

//     try {
//         const result = await MakeHelp.findByIdAndUpdate(
//             helpId,
//             {
//                 $set: {
//                     latitude,
//                     longitude,
//                     lastLocationUpdate: new Date()
//                 },
//                 $push: {
//                     locationHistory: {
//                         latitude,
//                         longitude,
//                         timestamp: new Date()
//                     }
//                 }
//             },
//             { new: true }
//         );

//         if (!result) {
//             console.log("❌ Help not found:", helpId);
//         }

//     } catch (error) {
//         console.error("Error updating location:", error);
//     }
// });



// /*
//     socket.on('update-location', async (data) => {
//     const { helpId, latitude, longitude, timestamp } = data;
    
//     console.log(`📍 Location update received for ${helpId}: ${latitude}, ${longitude}`);
    
//     // Update MongoDB
//     try {
//         const MakeHelp = mongoose.model('make help');
//         const result = await MakeHelp.findByIdAndUpdate(
//             helpId,
//             { 
//                 $set: { 
//                     latitude: latitude, 
//                     longitude: longitude,
//                     lastLocationUpdate: new Date(timestamp)
//                 },
//                 $push: {
//                     locationHistory: {
//                         latitude: latitude,
//                         longitude: longitude,
//                         timestamp: new Date(timestamp)
//                     }
//                 }
//             },
//             { new: true }
//         );
        
//         if (result) {
//             console.log(`✅ Database updated for help ${helpId}`);
//             // Send confirmation back
//             socket.emit('location-updated', {
//                 type: 'location-updated',
//                 helpId: helpId,
//                 latitude: latitude,
//                 longitude: longitude,
//                 confirmed: true
//             });
//         } else {
//             console.log(`❌ Help request ${helpId} not found`);
//         }
//     } catch (error) {
//         console.error('Error updating location:', error);
//     }
// });
// */
    
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
    
//     // Handle errors
//     socket.on('error', (error) => {
//         console.error('Socket error:', error);
//     });
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server is ready on port ${PORT}`);
});

// Export io for use in other controllers
export { io };



// import express from 'express';
// import bodyParser from 'body-parser';
// import userRouter from './routes/userRoutes.js';
// import mongoose from 'mongoose';
// import 'dotenv/config'
// import vehicleRouter from './routes/vehicleRoutes.js';
// import technicianRoute from './routes/technicianRoutes.js';
// import helpRouter from './routes/helpRoutes.js';
// import approvalRouter from './routes/approvalRoutes.js';


// const app = express();

// app.use(bodyParser.json());

// app.use(bodyParser.json());

// console.log(process.env.PASSWORD);
// const password = process.env.PASSWORD;

// const mongodbURL = `mongodb+srv://tester:${password}@cluster0.3drlv9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// mongoose.connect(mongodbURL).
// then(()=>{
//     console.log("Connected to MongoDB");
// }).
// catch(()=>{
//     console.log("Failed to connect to MongoDB");
// });

// app.use('/api/users', userRouter);
// app.use('/api/technician', technicianRoute);
// app.use('/api/vehicle', vehicleRouter);
// app.use('/api/users/help', helpRouter);
// app.use('/api/users/approval-help', approvalRouter);

// const PORT = process.env.PORT || 5000;


// app.listen(PORT, (req, res)=>{
//     console.log(`Server is running on port ${PORT}`);
// });

