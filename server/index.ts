import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.ts';
import profileRoutes from './routes/profiles.ts';
import jobRoutes from './routes/jobs.ts';
import messageRoutes from './routes/messages.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.warn('MONGODB_URI not configured. API will not be able to connect to MongoDB.');
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Mongo connection error', error));
}

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/jobs', jobRoutes);
app.use('/messages', messageRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
