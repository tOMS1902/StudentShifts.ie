import { Schema, model, Types } from 'mongoose';

export interface IApplication {
    jobId: Types.ObjectId;
    studentId: Types.ObjectId;
    status: 'applied' | 'review' | 'interview' | 'rejected' | 'accepted';
    coverLetter?: string;
    appliedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
    {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['applied', 'review', 'interview', 'rejected', 'accepted'],
            default: 'applied'
        },
        coverLetter: String,
        appliedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export const Application = model<IApplication>('Application', applicationSchema);
