import { Router } from 'express';
import { store } from '../services/store.js';
import { triageEmergencyReport } from '../services/gemini.js';
const router = Router();
// GET /api/reports - Get all emergency reports
router.get('/', (req, res) => {
    try {
        const reports = store.getReports();
        res.json({ success: true, data: reports });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch emergency reports' });
    }
});
// GET /api/reports/:id - Get single emergency report
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const report = store.getReportById(id);
        if (!report) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }
        res.json({ success: true, data: report });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch report details' });
    }
});
// POST /api/reports - Submit citizen SOS report & trigger Gemini AI triage
router.post('/', async (req, res) => {
    try {
        const { rawText, imageBase64, imageUrl, location } = req.body;
        if (!rawText || typeof rawText !== 'string' || rawText.trim() === '') {
            return res.status(400).json({ success: false, error: 'Missing required field: rawText' });
        }
        const reportLocation = {
            lat: Number(location?.lat) || 28.6139,
            lng: Number(location?.lng) || 77.2090,
            address: location?.address || 'New Delhi Relief Zone'
        };
        // Perform Gemini AI triage (or heuristic fallback if API key unconfigured)
        const analysis = await triageEmergencyReport(rawText, imageBase64 || imageUrl);
        const newReport = {
            id: `rep-${Date.now()}`,
            createdAt: new Date().toISOString(),
            rawText,
            imageUrl: imageUrl || imageBase64 || undefined,
            location: reportLocation,
            analysis,
            status: 'Open'
        };
        const savedReport = store.addReport(newReport);
        res.status(201).json({ success: true, data: savedReport });
    }
    catch (error) {
        console.error('[AegisRelief] Error creating emergency report:', error);
        res.status(500).json({ success: false, error: 'Failed to process emergency report' });
    }
});
export default router;
