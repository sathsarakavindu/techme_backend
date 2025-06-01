import express from "express";
import { cancellMadeHelp, getMadeHelps, makeHelp } from "../controllers/helpController.js";

const helpRouter = express.Router();

helpRouter.post('/make-help/', makeHelp);
helpRouter.post('/cancel-help/', cancellMadeHelp);
helpRouter.get('/get-helps/', getMadeHelps);

export default helpRouter;