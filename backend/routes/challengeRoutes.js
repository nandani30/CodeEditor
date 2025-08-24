import express from "express";
import { submitCodingChallenge, submitQuizChallenge , getChallengeDetails} from "../controllers/challenge/challenge.js";
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Coding challenge submission
router.post("/coding/:challengeId/submit", protect, submitCodingChallenge);

// Quiz challenge submission
router.post("/quiz/:challengeId/submit", protect, submitQuizChallenge);

//Get challenge details
router.get("/:challengeId/details", getChallengeDetails);

export default router;
