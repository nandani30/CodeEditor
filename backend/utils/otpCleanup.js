import cron from 'node-cron';
import prisma from '../prismaClient.js';

const startOtpCleanupJob = () => {
  // Every 5 minutes: */5 * * * *
  cron.schedule('*/5 * * * *', async () => {
    try {
      const result = await prisma.emailOTP.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        console.log(`[OTP Cleanup] Deleted ${result.count} expired OTP(s) at ${new Date().toISOString()}`);
      }
    } catch (error) {
      console.error('[OTP Cleanup] Failed to delete expired OTPs:', error);
    }
  });

  console.log('[OTP Cleanup] Scheduled job to run every 5 minutes.');
};

export default startOtpCleanupJob;