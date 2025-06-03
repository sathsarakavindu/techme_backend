import express from "express";
import { cancellMadeHelp, getHelpById, getMadeHelps, getUserHelps, helpApprove, makeHelp } from "../controllers/helpController.js";

const helpRouter = express.Router();

helpRouter.post('/make-help/', makeHelp);
helpRouter.post('/cancel-help/', cancellMadeHelp);
helpRouter.post('/approve-help/', helpApprove);
helpRouter.get('/get-helps/', getMadeHelps);
// Get help requests by user email
helpRouter.get('/user/:email', getUserHelps);

// Get specific help request by ID
helpRouter.get('/:help_id', getHelpById);


export default helpRouter;