import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import projectInfo from '../controllers/info/projectInfo.js';
import getProjectStructure from '../controllers/editor/getProjectStructure.js';

const router = express.Router();

router.use(protect);

router.get('/:projectId', projectInfo);                  // Project metadata
router.get('/:projectId/structure', getProjectStructure); // Files + folders

export default router;
