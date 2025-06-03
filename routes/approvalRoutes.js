import express from "express";
import { approvalHelp } from "../controllers/approvalController.js";

const approvalRouter = express.Router();

approvalRouter.post('/', approvalHelp);

export default approvalRouter;