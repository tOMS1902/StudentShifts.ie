import { Schema, model, Types } from 'mongoose';

export interface IExperience {
  role: string;
  company: string;
  period: string;
}

export interface IStudentProfile {
  userId: Types.ObjectId;
  phone?: string;
  university?: string;
  degree?: string;
  bio?: string;
  skills: string[];
  experience: IExperience[];
  portfolioUrl?: string;
  linkedInUrl?: string;
}

const experienceSchema = new Schema<IExperience>(
  {
    role: String,
    company: String,
    period: String
  },
  { _id: false }
);

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    phone: String,
    university: String,
    degree: String,
    bio: String,
    skills: { type: [String], default: [] },
    experience: { type: [experienceSchema], default: [] },
    portfolioUrl: String,
    linkedInUrl: String
  },
  { timestamps: true }
);

export const StudentProfile = model<IStudentProfile>('StudentProfile', studentProfileSchema);
