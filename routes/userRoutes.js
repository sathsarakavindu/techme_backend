import express from 'express';
import { getUsers, postUser, putUser, deleteUser, changePassword, sentOTPToUser, checkOTPValidation, forgotPasswordUpdate } from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post('/signin/', getUsers);

userRouter.post('/forgot-password/', sentOTPToUser);

userRouter.post('/register/', postUser);

userRouter.post('/check-otp/', checkOTPValidation);

userRouter.post('/change-password/', changePassword);

userRouter.post('/update-forgot-password/', forgotPasswordUpdate);

userRouter.put('/update/', putUser);

userRouter.delete('/delete/', deleteUser);

export default userRouter;