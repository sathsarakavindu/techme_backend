import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRouter from './routes/userRoutes.js';
import vehicleRouter from './routes/vehicleRoutes.js';
import technicianRoute from './routes/technicianRoutes.js';
import helpRouter from './routes/helpRoutes.js';
import approvalRouter from './routes/approvalRoutes.js';
import MakeHelp from './models/helpModel.js';

const app = express();

app.use(bodyParser.json());

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"]
    }
});

const password = process.env.PASSWORD;

const mongodbURL = `mongodb+srv://tester:${password}@cluster0.3drlv9w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongodbURL)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
});

app.use('/api/users', userRouter);
app.use('/api/technician', technicianRoute);
app.use('/api/vehicle', vehicleRouter);
app.use('/api/users/help', helpRouter);
app.use('/api/users/approval-help', approvalRouter);

io.on("connection", (socket)=>{

    console.log("Client Connected");

    socket.on("update_location", async (data)=>{

        try{

            const {
                helpId,
                latitude,
                longitude
            } = data;

            await MakeHelp.findByIdAndUpdate(
                helpId,
                {
                    latitude,
                    longitude,
                    updatedAt:new Date()
                }
            );

            io.emit(
                "location_updated",
                {
                    helpId,
                    latitude,
                    longitude
                }
            );

        }catch(error){

            console.log(error);

        }

    });

    socket.on("disconnect", ()=>{

        console.log("Client disconnected");

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>{

    console.log(`Server running on ${PORT}`);

});



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

