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

// Update job
router.put('/:id', requireAuth(['employer']), async (req: AuthRequest, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', requireAuth(['employer']), async (req: AuthRequest, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Toggle job status (active/closed)
router.patch('/:id/status', requireAuth(['employer']), async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify ownership
    if (job.employerId.toString() !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    job.status = status;
    await job.save();

    res.json(job);
  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({ error: 'Failed to toggle job status' });
  }
});

export default router;
