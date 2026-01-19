import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { StudentProfile } from '../models/StudentProfile';

const router = Router();

router.get('/:userId', requireAuth(), async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

router.put('/:userId', requireAuth(['student']), async (req: AuthRequest, res) => {
  try {
    if (req.user?.id !== req.params.userId) {
      return res.status(403).json({ error: 'Cannot modify another user profile.' });
    }
    const payload = req.body;
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: payload },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error('Update profile error', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
