import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './server/models/User.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) { console.error('No MONGODB_URI'); process.exit(1); }

async function checkLatestUser() {
    try {
        await mongoose.connect(mongoUri!);

        // Find latest user sorted by _id (timestamp embedded) or createdAt
        const user = await User.findOne().sort({ $natural: -1 }); // or createdAt if schema has it

        console.log('\n🔍 Latest User Found:');
        if (user) {
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`ID: ${user._id}`);
        } else {
            console.log('No users found in database.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkLatestUser();
