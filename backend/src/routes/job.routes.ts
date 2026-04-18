import { Router } from 'express';
import * as jobController from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/suggest-skills', jobController.suggestSkills);
router.get('/:id', jobController.getJobById);

// Admin only routes
router.use(authenticate);
router.post('/', requireRole('ADMIN'), jobController.createJob);
router.put('/:id', requireRole('ADMIN'), jobController.updateJob);
router.delete('/:id', requireRole('ADMIN'), jobController.deleteJob);

export default router;