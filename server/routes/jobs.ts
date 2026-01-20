import { Router } from 'express';
import { Job } from '../models/Job.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('List jobs error', error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

router.post('/', requireAuth(['employer']), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const payload = {
      ...req.body,
      employerId: req.user.id,
      company: req.body.company || req.body.companyName
    };
    const job = await Job.create(payload);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error', error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

export default router;
