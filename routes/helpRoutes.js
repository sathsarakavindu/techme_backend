import express from "express";
import { makeHelp } from "../controllers/helpController.js";

const helpRouter = express.Router();

helpRouter.post('/make-help/', makeHelp);

export default helpRouter;