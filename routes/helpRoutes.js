import express from "express";
import { cancellMadeHelp, makeHelp } from "../controllers/helpController.js";

const helpRouter = express.Router();

helpRouter.post('/make-help/', makeHelp);
helpRouter.post('/cancel-help/', cancellMadeHelp);

export default helpRouter;