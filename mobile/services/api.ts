import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';
import { Job, Application, Message } from '../types';

async function getHeaders() {
    const user = await AsyncStorage.getItem('ss:user');
    const token = user ? JSON.parse(user).token : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

export const apiService = {
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        return data;
    },

    register: async (userData: any) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        return data;
    },

    getJobs: async (): Promise<Job[]> => {
        const res = await fetch(`${API_URL}/jobs`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return data;
    },

    getJob: async (id: string): Promise<Job> => {
        const res = await fetch(`${API_URL}/jobs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch job details');
        return data;
    },

    postJob: async (jobData: any) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers,
            body: JSON.stringify(jobData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to create job: ${res.statusText}`);
        return data;
    },

    // Alias for compatibility if used elsewhere, currently App.tsx uses postJob
    createJob: async (jobData: any) => {
        return apiService.postJob(jobData);
    },

    applyToJob: async (jobId: string) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ jobId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to apply');
        return data;
    },

    getMyApplications: async (): Promise<Application[]> => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/applications/me`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch applications');

        // Map backend format to frontend interface
        return data.map((app: any) => ({
            id: app._id,
            jobTitle: app.jobId?.title || 'Unknown Job',
            company: app.jobId?.company || 'Unknown Company',
            status: app.status,
            location: app.jobId?.location || 'Unknown Location',
            dateApplied: app.appliedAt
        }));
    },

    // Profiles
    updateProfile: async (profileData: any) => {
        const headers = await getHeaders();
        const userStr = await AsyncStorage.getItem('ss:user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (!user || (!user.id && !user._id)) throw new Error('User not found');
        const userId = user.id || user._id;

        const res = await fetch(`${API_URL}/profiles/${userId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(profileData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update profile');
        return data;
    },

    // Messages
    getMessages: async (jobId: string): Promise<Message[]> => {
        const headers = await getHeaders();
        // Assume student role
        const res = await fetch(`${API_URL}/messages?jobId=${jobId}`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');

        return data.map((msg: any) => ({
            ...msg,
            isMe: msg.senderRole === 'student' // Assuming we are logged in as student
        }));
    },

    sendMessage: async (jobId: string, text: string) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ jobId, text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send message');
        return data;
    }
};
