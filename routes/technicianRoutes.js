import express from 'express';
import { deleteTechnician, getTechnician, postTechnical, putTechnician } from '../controllers/technicianController';

const technicianRoute = express.Router();

technicianRoute.post('/register/', postTechnical);
technicianRoute.get('/signin/', getTechnician);
technicianRoute.put('/update/', putTechnician);
technicianRoute.delete('/delete/', deleteTechnician);

export default technicianRoute;