
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';
import { Job, Application } from '../types';

async function getHeaders() {
    const user = await AsyncStorage.getItem('ss:user');
    const token = user ? JSON.parse(user).token : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export const apiService = {
    // Auth
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

    // Jobs
    getJobs: async (): Promise<Job[]> => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/jobs`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch jobs');
        return data;
    },

    getJob: async (id: string): Promise<Job> => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/jobs/${id}`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch job');
        return data;
    },

    createJob: async (jobData: Partial<Job>): Promise<Job> => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers,
            body: JSON.stringify(jobData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create job');
        return data;
    },

    // Applications
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
        return data;
    }
};
