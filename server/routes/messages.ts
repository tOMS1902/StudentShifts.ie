import { Router } from 'express';
import { Message } from '../models/Message.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth(['employer', 'student']), async (req: AuthRequest, res: any) => {
  try {
    const { jobId, studentId } = req.query;
    const filter: Record<string, unknown> = {};

    // If student, can only see their own messages
    if (req.user?.role === 'student') {
      filter.studentId = req.user.id;
    }
    // If employer, can see all (or filtered by query)
    else {
      if (studentId) filter.studentId = studentId;
    }

    if (jobId) filter.jobId = jobId;

    const messages = await Message.find(filter).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    console.error('List messages error', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

router.post('/', requireAuth(['student', 'employer']), async (req: AuthRequest, res: any) => {
  try {
    const { jobId, text, studentId, studentName } = req.body; // studentId required if employer sending

    // Determine the target student ID
    const targetStudentId = req.user?.role === 'student' ? req.user.id : studentId;

    if (!jobId || !text || !targetStudentId) {
      return res.status(400).json({ error: 'jobId, text and studentId are required.' });
    }

    const message = await Message.create({
      jobId,
      text,
      studentName: studentName || (req.user?.role === 'student' ? 'Student' : 'Employer'),
      studentId: targetStudentId,
      senderRole: req.user?.role, // Ideally add this field to schema, for now just create text
      timestamp: new Date(),
      isRead: false
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

export default router;
