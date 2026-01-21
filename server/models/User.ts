import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  passwordHash: string;
  role: 'student' | 'employer';
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'employer'], required: true },
    firstName: { type: String },
    lastName: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes for performance
userSchema.index({ email: 1 }); // Already unique, but explicit
userSchema.index({ role: 1 });

export const User = model<IUser>('User', userSchema);
