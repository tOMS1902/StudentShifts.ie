import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './server/models/User.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

async function checkUsers() {
    try {
        await mongoose.connect(mongoUri!);
        console.log('✅ Connected to MongoDB');

        const count = await User.countDocuments({});
        console.log('\n📊 User Statistics:');
        console.log(`Total Signed Up Users: ${count}`);

        const students = await User.countDocuments({ role: 'student' });
        const employers = await User.countDocuments({ role: 'employer' });

        console.log(`- Students: ${students}`);
        console.log(`- Employers: ${employers}`);

    } catch (error) {
        console.error('Error querying users:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkUsers();
