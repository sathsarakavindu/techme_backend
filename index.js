import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoutes.js';
import mongoose from 'mongoose';
import 'dotenv/config'
import vehicleRouter from './routes/vehicleRoutes.js';
import technicianRoute from './routes/technicianRoutes.js';
import helpRouter from './routes/helpRoutes.js';


const app = express();

app.use(bodyParser.json());

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

app.listen(5000, (req, res)=>{
    console.log("Server is running on port 5000");
});

