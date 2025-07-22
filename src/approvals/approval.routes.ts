import express from "express";
import { ApprovalController } from "./approal.controller";

const router = express.Router();

router.post("/process", ApprovalController.processApproval);

export default router;
