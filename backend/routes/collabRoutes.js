import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { startSession, stopSession, removeCollaborator } from "../controllers/editor/collab.js";

const router = express.Router();

router.post("/:projectId/start", protect, startSession);
router.post("/:projectId/stop", protect, stopSession);
router.delete("/:projectId/remove/:collaboratorId", protect, removeCollaborator);

export default router;
