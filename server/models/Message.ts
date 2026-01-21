import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  jobId: Types.ObjectId;
  studentId: Types.ObjectId;
  studentName: string;
  senderRole: 'student' | 'employer';
  text: string;
  timestamp: Date;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    senderRole: { type: String, enum: ['student', 'employer'], default: 'student' },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Indexes for performance
messageSchema.index({ jobId: 1, timestamp: -1 }); // Messages for a job, newest first
messageSchema.index({ studentId: 1, timestamp: -1 }); // Student's messages

export const Message = model<IMessage>('Message', messageSchema);
