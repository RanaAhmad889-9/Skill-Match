import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/skills', userController.addSkills);
router.delete('/skills/:skill', userController.removeSkill);
router.post('/resume', upload.single('resume'), userController.uploadResume);
router.get('/matches', userController.getMatches);
router.get('/skill-gap', userController.getSkillGap);

// Admin only
router.get('/', requireRole('ADMIN'), userController.getAllUsers);
router.delete('/:id', requireRole('ADMIN'), userController.deleteUser);
router.patch('/:id/promote', requireRole('ADMIN'), userController.promoteToAdmin);

export default router;