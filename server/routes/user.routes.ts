import { Router } from 'express';
import { getUnlockedItems } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/unlocked-items', protect, getUnlockedItems);

export default router; 