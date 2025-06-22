import { Router } from 'express';
import { getStoreItems, unlockItem } from '../controllers/store.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/items', getStoreItems);
router.post('/unlock', protect, unlockItem);

export default router; 