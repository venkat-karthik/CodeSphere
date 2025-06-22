import { Router } from 'express';
import { getAnalytics, getStudents, addStudent, grantCoins } from '../controllers/admin.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = Router();

// All routes in this file are protected and for admins only
router.use(protect, admin);

router.get('/analytics', getAnalytics);
router.get('/students', getStudents);
router.post('/students', addStudent);
router.post('/students/:id/grant-coins', grantCoins);

export default router; 