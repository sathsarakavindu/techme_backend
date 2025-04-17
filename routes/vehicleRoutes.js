import express from 'express';
import { addVehicle, deleteVehicle, getVehicles, updateVehicle } from '../controllers/addVehicleController.js';

const vehicleRouter = express.Router();

vehicleRouter.post('/add-vehicle/', addVehicle);

vehicleRouter.get('/get-vehicle/', getVehicles);

vehicleRouter.put('/edit-vehicle', updateVehicle);

vehicleRouter.delete('/delete-vehicle', deleteVehicle);

export default vehicleRouter;