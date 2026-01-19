export default function handler(req, res) {
    res.status(200).json({
        message: 'Hello from Vercel JS',
        env: process.env.NODE_ENV
    });
}
