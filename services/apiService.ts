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
    try {
      const userStr = localStorage.getItem('ss:user');
      let token = '';
      let userId = '';
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token || '';
        userId = user.id || user._id || user.studentId;
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

  async getJob(id: string): Promise<JobListing | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      const job = await response.json();
      return { ...job, id: job._id || job.id };
    } catch (error) {
      console.error('Get Job Error:', error);
      return null;
    }
  },

  // Job Management
  async postJob(job: Partial<JobListing>): Promise<JobListing | null> {
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

      const errText = await response.text();
      console.error('Post Job Failed:', response.status, response.statusText, errText);
      throw new Error(`Failed to create job: ${response.status} ${errText}`);
    } catch (error) {
      console.error('Post Job Error:', error);
      throw error;
    }
  },

  // Applications
  async applyToJob(jobId: string): Promise<any> {
    const userStr = localStorage.getItem('ss:user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ jobId }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to apply');
    }
    return await response.json();
  },

  async getMyApplications(): Promise<any[]> {
    const userStr = localStorage.getItem('ss:user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const response = await fetch(`${API_BASE_URL}/applications/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch applications');
    const data = await response.json();

    // Map backend format to frontend interface
    return data.map((app: any) => ({
      id: app._id,
      jobId: app.jobId?._id || app.jobId,
      studentId: app.studentId,
      status: app.status,
      appliedDate: app.appliedAt,
      jobTitle: app.jobId?.title || 'Unknown Job',
      companyName: app.jobId?.company || 'Unknown Company',
      location: app.jobId?.location || 'Unknown Location'
    }));
  },

  // Messages
  async getMessages(jobId: string): Promise<any[]> {
    const userStr = localStorage.getItem('ss:user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token || '';

    const response = await fetch(`${API_BASE_URL}/messages?jobId=${jobId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch messages');
    const data = await response.json();

    return data.map((msg: any) => ({
      ...msg,
      id: msg._id,
      // Determine if it's "me" based on senderRole. 
      // If I am a student, keys with senderRole='student' are me.
      isMe: (user?.mode === 'student' && msg.senderRole === 'student') ||
        (user?.mode === 'employer' && msg.senderRole === 'employer')
    }));
  },

  async sendMessage(jobId: string, text: string): Promise<any> {
    const userStr = localStorage.getItem('ss:user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ jobId, text }),
    });

    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  },

  async updateJob(jobId: string, jobData: Partial<JobListing>): Promise<any> {
    const userStr = localStorage.getItem('ss:user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) throw new Error('Failed to update job');
    return await response.json();
  },

  async deleteJob(jobId: string): Promise<void> {
    const userStr = localStorage.getItem('ss:user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) throw new Error('Failed to delete job');
  },

  async toggleJobStatus(jobId: string, status: 'active' | 'closed'): Promise<any> {
    const userStr = localStorage.getItem('ss:user');
    const token = userStr ? JSON.parse(userStr).token : '';

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Failed to toggle job status');
    return await response.json();
  }
};
