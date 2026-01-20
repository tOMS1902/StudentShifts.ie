
export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    JobDetails: { jobId: string };
    ProfileSetup: undefined;
    Applications: undefined;
    EmployerDashboard: undefined;
    ManageShift: { shiftId: string };
    EmployerOnboarding: undefined;
    PostShift: undefined;
    Chat: { jobId: string };
    PublicProfile: { studentId: string };
};

export interface Message {
    _id: string;
    text: string;
    timestamp: string;
    senderRole: 'student' | 'employer';
    isMe?: boolean; // Derived on frontend
}

export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    description: string;
    tags: string[];
    // Computed/Optional fields from backend
    postedAt?: string;
    logoUrl?: string; // Might not be on backend yet, keep optional
    pay?: number; // Helper for display if we compute it
    type?: string;
}

export interface Application {
    id: string;
    jobTitle: string;
    company: string;
    status: 'applied' | 'interview' | 'review' | 'rejected' | 'accepted';
    location: string;
    dateApplied: string;
}

export interface Experience {
    role: string;
    company: string;
    period: string;
}

export interface StudentProfile {
    userId?: string;
    phone?: string;
    university?: string;
    degree?: string;
    dob?: string;
    bio?: string;
    skills: string[];
    experience: Experience[];
    portfolioUrl?: string;
    linkedInUrl?: string;
}
