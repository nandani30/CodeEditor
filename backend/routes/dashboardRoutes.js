import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import dashboardInfo from '../controllers/info/dashboardInfo.js';

const router = express.Router();

router.use(protect);

router.get('/', dashboardInfo); // GET /api/dashboard

export default router;
