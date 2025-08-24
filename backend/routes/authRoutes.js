import express from 'express';
import { sendOtpHandler, verifyOtpHandler } from '../controllers/auth/emailSignup.js';
import emailLogin  from '../controllers/auth/emailLogin.js';
import {
  googleAuthRedirect,
  googleAuthCallback
} from '../controllers/auth/googleAuth.js';

const router = express.Router();

router.post('/signup/send-otp', sendOtpHandler);
router.post('/signup/verify-otp', verifyOtpHandler);
router.post('/login', emailLogin);
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);

export default router;
