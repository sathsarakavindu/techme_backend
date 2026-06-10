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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(bodyParser.json());

console.log(process.env.PASSWORD);
const password = process.env.PASSWORD;

const mongodbURL = `mongodb+srv://tester:${password}@cluster0.3drlv9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongodbURL).
then(()=>{
    console.log("Connected to MongoDB");
}).
catch(()=>{
    console.log("Failed to connect to MongoDB");
});

app.use('/api/users', userRouter);
app.use('/api/technician', technicianRoute);
app.use('/api/vehicle', vehicleRouter);
app.use('/api/users/help', helpRouter);
app.use('/api/users/approval-help', approvalRouter);

// WebSocket connection handling
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
    
    // Handle location updates
    socket.on('update-location', async (data) => {
        const { helpId, latitude, longitude, timestamp } = data;
        
        // Update MongoDB with new location
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
            
            // Broadcast location update to all connected clients in this help request room
            io.to(`help_${helpId}`).emit('location-updated', {
                helpId: helpId,
                latitude: latitude,
                longitude: longitude,
                timestamp: timestamp
            });
            
            console.log(`Location updated for help ${helpId}: ${latitude}, ${longitude}`);
        } catch (error) {
            console.error('Error updating location:', error);
            socket.emit('location-update-error', { message: error.message });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
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

