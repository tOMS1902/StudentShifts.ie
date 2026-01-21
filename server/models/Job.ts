import { Schema, model, Types } from 'mongoose';

export interface IJob {
  employerId: Types.ObjectId;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  description: string;
  responsibilities: string[];
  skills: string[];
  status: 'active' | 'closed';
  deadline?: Date;
  postedAt?: string;
  applicantCount?: number;
}

const jobSchema = new Schema<IJob>(
  {
    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    tags: { type: [String], default: [] },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
    deadline: { type: Date },
    postedAt: { type: String },
    applicantCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes for performance
jobSchema.index({ status: 1, createdAt: -1 }); // Most common query: active jobs, newest first
jobSchema.index({ employerId: 1 }); // Employer's jobs
jobSchema.index({ title: 'text', description: 'text' }); // Text search

export const Job = model<IJob>('Job', jobSchema);
