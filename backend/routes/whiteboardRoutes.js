import express from "express";
import { getWhiteboard, saveWhiteboard } from "../controllers/editor/whiteboard.js";

const router = express.Router();

// GET project whiteboard
router.get("/:projectId/whiteboard", getWhiteboard);

// SAVE/UPDATE project whiteboard
router.post("/:projectId/whiteboard", saveWhiteboard);

export default router;
