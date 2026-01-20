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
    console.log('SERVER: Create Job Request Body:', req.body);
    console.log('SERVER: Create Job User:', req.user);

    if (!req.user) {
      console.warn('SERVER: Unauthorized attempt to create job');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const payload = {
      ...req.body,
      employerId: req.user.id,
      company: req.body.company || req.body.companyName
    };

    console.log('SERVER: Job Payload:', payload);

    const job = await Job.create(payload);
    console.log('SERVER: Job Created Successfully:', job._id);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job.' });
  }
});

export default router;
