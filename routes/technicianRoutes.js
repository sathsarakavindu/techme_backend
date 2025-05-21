import express from 'express';
import { signInTechnician, postTechnical, sentOTPToTechnician, checkOTPValidationForTechnician, changePasswordTechnician, forgotPasswordUpdateForTechnician } from '../controllers/technicianController.js';

const technicianRoute = express.Router();

technicianRoute.post('/register/', postTechnical);
technicianRoute.post('/signin/', signInTechnician);
technicianRoute.post('/forgot-password/', sentOTPToTechnician);
technicianRoute.post('/check-otp/', checkOTPValidationForTechnician);
technicianRoute.post('/change-password/', changePasswordTechnician);
technicianRoute.put('/update-forgot-password/', forgotPasswordUpdateForTechnician);
export default technicianRoute;