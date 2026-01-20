import { Router } from 'express';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Apply to a job
router.post('/', requireAuth(['student']), async (req: AuthRequest, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if already applied
        const existing = await Application.findOne({
            jobId,
            studentId: req.user!.id
        });

        if (existing) {
            return res.status(400).json({ error: 'You have already applied to this job' });
        }

        const application = await Application.create({
            jobId,
            studentId: req.user!.id,
            coverLetter
        });

        // Increment applicant count on job
        await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

        res.status(201).json(application);
    } catch (error) {
        console.error('Apply error:', error);
        res.status(500).json({ error: 'Failed to apply to job' });
    }
});

// Get my applications (Student)
router.get('/me', requireAuth(['student']), async (req: AuthRequest, res) => {
    try {
        const applications = await Application.find({ studentId: req.user!.id })
            .populate('jobId', 'title company location salaryMin salaryMax type')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// Get applications for a job (Employer)
router.get('/job/:jobId', requireAuth(['employer']), async (req: AuthRequest, res) => {
    try {
        // Verify ownership of job? For now just return list
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('studentId', 'firstName lastName email') // Populate user details
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Get job applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applicants' });
    }
});

export default router;
