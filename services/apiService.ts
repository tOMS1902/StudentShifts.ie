import { User, StudentProfile, JobListing } from '../types';

// In development, Vite proxies /api to localhost:4000
// In production (Vercel), /api is routed to the serverless function
const API_BASE_URL = '/api';

export const apiService = {
  // User Authentication
  async login(email: string, pass: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Login Error:', error);
      throw error;
    }
  },

  async register(data: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Register Error:', error);
      throw error;
    }
  },

  // Profile Management
  async saveStudentProfile(profile: StudentProfile): Promise<boolean> {
    // Note: You need to implement token handling for authenticated requests
    // For now, we'll just try to send it if we had a token implementation
    try {
      // Placeholder: We need the JWT token from login to authorize this.
      // Assuming we might store it in localStorage or state.
      const userStr = localStorage.getItem('ss:user');
      let token = '';
      let userId = '';
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token || '';
        userId = user.id || user._id;
      }

      if (!userId) {
        console.error('No user ID found');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      return response.ok;
    } catch (e) {
      console.error('Save Profile Error:', e);
      return false;
    }
  },

  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${userId}`);
      if (response.ok) return await response.json();
      return null;
    } catch (error) {
      console.error('Get Profile Error:', error);
      return null;
    }
  },

  async getJobs(): Promise<JobListing[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const jobs = await response.json();
      // Map _id to id for frontend
      return jobs.map((j: any) => ({ ...j, id: j._id || j.id }));
    } catch (error) {
      console.error('Get Jobs Error:', error);
      return [];
    }
  },

  // Job Management
  async postJob(job: Partial<JobListing>): Promise<JobListing | null> {
    // Similar to save profile, needs auth
    try {
      const userStr = localStorage.getItem('ss:user');
      let token = '';
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token || '';
      }

      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(job)
      });

      if (response.ok) return await response.json();
      return null;
    } catch (error) {
      console.error('Post Job Error:', error);
      return null;
    }
  }
};
