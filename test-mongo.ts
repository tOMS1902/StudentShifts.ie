import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const mongoUri = process.env.MONGODB_URI;

console.log('=== MongoDB Connection Diagnostic ===');
console.log('MongoDB URI (masked):', mongoUri?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
console.log('Attempting connection...\n');

if (!mongoUri) {
    console.error('ERROR: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB!');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ FAILED: Could not connect to MongoDB');
        console.error('\nError Details:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.code) console.error('Code:', error.code);
        if (error.codeName) console.error('Code Name:', error.codeName);
        console.error('\nFull Error:', JSON.stringify(error, null, 2));
        process.exit(1);
    });
