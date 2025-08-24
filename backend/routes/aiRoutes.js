import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import { getCodeSuggestion } from "../controllers/aiFeatures/codeSuggestion.js";
import { analyzeCodeQuality } from "../controllers/aiFeatures/codeQualityAnalysis.js";
import { handleAIRequest } from "../controllers/aiFeatures/aiAssistent.js";
import { getProjectChats } from "../controllers/aiFeatures/getAiChat.js";
import { generateFlashcardAndChallenge } from "../controllers/aiFeatures/aiFlashcardsAndChallenge.js";

const router = express.Router();

router.use(protect);

router.post("/suggest", getCodeSuggestion);
router.post("/quality", analyzeCodeQuality);
router.post("/:projectId", handleAIRequest);
router.get("/:projectId", getProjectChats);
router.post("/:projectId/flashcard", generateFlashcardAndChallenge)

export default router;
