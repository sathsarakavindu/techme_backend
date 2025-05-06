import express from 'express';
import { deleteTechnician, signInTechnician, postTechnical, putTechnician } from '../controllers/technicianController.js';

const technicianRoute = express.Router();

technicianRoute.post('/register/', postTechnical);
technicianRoute.post('/signin/', signInTechnician);
technicianRoute.put('/update/', putTechnician);
technicianRoute.delete('/delete/', deleteTechnician);

export default technicianRoute;