import runCode from '../controllers/editor/executeFile.js';
import runFrameworkProject from '../controllers/editor/executeFramework.js';
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/file', runCode);
router.post('/framework',runFrameworkProject);

export default router;