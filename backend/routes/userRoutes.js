import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import userInfo from '../controllers/info/userInfo.js';
import { createFlashcard, updateFlashcard, deleteFlashcard } from '../controllers/flashcard/flashcards.js';

const router = express.Router();

router.use(protect);

router.get('/me', userInfo);
router.post("/:projectId/flashcards", protect, createFlashcard);
router.put("/:projectId/flashcards/:id", protect, updateFlashcard);
router.delete("/:projectId/flashcards/:id", protect, deleteFlashcard);

export default router;
