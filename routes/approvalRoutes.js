import express from "express";
import { approvalHelp, removeApprovalHelp } from "../controllers/approvalController.js";

const approvalRouter = express.Router();

approvalRouter.post('/', approvalHelp);
approvalRouter.post('/remove-approval-help', removeApprovalHelp);

export default approvalRouter;