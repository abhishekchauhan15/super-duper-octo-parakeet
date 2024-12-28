import express from 'express';
import { getWellPerformingAccounts, getOrderingPatterns, getUnderperformingAccounts } from '../controllers/performanceController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getWellPerformingAccounts);
router.get('/patterns/:leadId', auth, getOrderingPatterns);
router.get('/underperforming', auth, getUnderperformingAccounts);

export default router;
