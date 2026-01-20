
import mongoose from 'mongoose';
import { Job } from './server/models/Job';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const uri = process.env.MONGODB_URI;

async function testConnection() {
    console.log('--- DB CONNECTION TEST ---');
    console.log('URI:', uri?.split('@')[1]); // Log only the host part for safety

    if (!uri) {
        console.error('ERROR: MONGODB_URI is missing');
        return;
    }

    try {
        await mongoose.connect(uri);
        console.log('SUCCESS: Connected to MongoDB!');

        // Try to create a dummy job
        const dummyJob = {
            employerId: new mongoose.Types.ObjectId(), // Fake ID
            title: "Test Job from Script",
            company: "Test Corp",
            location: "Test City",
            salaryMin: 10,
            salaryMax: 15,
            description: "This is a test job to verify writes.",
            tags: ["Test"],
            status: "active"
        };

        console.log('Attempting to save job...');
        const job = await Job.create(dummyJob);
        console.log('SUCCESS: Job saved with ID:', job._id);

        // Clean up
        await Job.findByIdAndDelete(job._id);
        console.log('Cleaned up test job.');

    } catch (error) {
        console.error('FAILURE:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

testConnection();
