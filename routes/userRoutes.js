import express from 'express';
import { getUsers, postUser, putUser, deleteUser } from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post('/signin/', getUsers);

userRouter.post('/register/', postUser);

userRouter.put('/update/', putUser);

userRouter.delete('/delete/', deleteUser);

export default userRouter;