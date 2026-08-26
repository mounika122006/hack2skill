import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import reportsRouter from './routes/reports.js';
import resourcesRouter from './routes/resources.js';
import matchRouter from './routes/match.js';
import { store } from './services/store.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AegisRelief API', timestamp: new Date().toISOString() });
});
// Metrics Endpoint
app.get('/api/metrics', (req, res) => {
    const metrics = store.getMetrics();
    res.json({ success: true, data: metrics });
});
// API Routes
app.use('/api/reports', reportsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/match', matchRouter);
// Serve static frontend in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));
// Catch-all route to serve index.html for SPA client-side routing
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
    }
    else {
        res.status(404).json({ success: false, error: 'API endpoint not found' });
    }
});
app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[AegisRelief] Express server running on port ${PORT} (host: 0.0.0.0)`);
});
