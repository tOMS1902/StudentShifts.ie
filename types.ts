
export enum UserMode {
  STUDENT = 'student',
  EMPLOYER = 'employer'
}

export interface User {
  mode: UserMode;
  email: string;
  studentId?: string;
  employerId?: string;
  token: string;
  firstName?: string;
  lastName?: string;
}

export interface Message {
  id: string; // _id from backend
  jobId: string;
  text: string;
  timestamp: string;
  senderRole: 'student' | 'employer';
  isMe?: boolean; // Frontend helper
  studentName?: string; // Optional for employer view
  studentId?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  bio: string;
  skills: string[];
  experience: Experience[];
  portfolioUrl: string;
  linkedInUrl: string;
}

export interface JobListing {
  id: string;
  _id?: string; // MongoDB ID from backend
  title: string;
  company: string;
  location: string;
  logo?: string;
  logoUrl?: string; // Backend might return logoUrl
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  description: string;
  responsibilities: string[];
  skills: string[];
  status: 'active' | 'closed';
  deadline: string;
  contact: string;
  applicantCount: number;
  postedAt: string;
  type?: string;
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  REVIEW = 'review',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected'
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedDate: string; // Mapped from appliedAt
  jobTitle: string;
  companyName: string;
  location: string;
  logo?: string;
}
