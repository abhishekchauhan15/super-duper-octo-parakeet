import express from 'express';
import { getAccountPerformance, getOrderingPatterns, getUnderperformingAccounts } from '../controllers/performanceController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/account/:leadId', auth, getAccountPerformance);
router.get('/patterns/:leadId', auth, getOrderingPatterns);
router.get('/underperforming', auth, getUnderperformingAccounts);

export default router;
