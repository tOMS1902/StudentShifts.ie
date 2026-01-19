import { Router } from 'express';
import { Message } from '../models/Message.ts';
import { requireAuth, AuthRequest } from '../middleware/auth.ts';

const router = Router();

router.get('/', requireAuth(['employer']), async (req, res) => {
  try {
    const { jobId } = req.query;
    const filter: Record<string, unknown> = {};
    if (jobId) filter.jobId = jobId;
    const messages = await Message.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (error) {
    console.error('List messages error', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

router.post('/', requireAuth(['student']), async (req: AuthRequest, res) => {
  try {
    const { jobId, text, studentName } = req.body;
    if (!jobId || !text) {
      return res.status(400).json({ error: 'jobId and text are required.' });
    }
    const message = await Message.create({
      jobId,
      text,
      studentName: studentName || 'Anonymous Student',
      studentId: req.user!.id,
      timestamp: new Date()
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

export default router;
