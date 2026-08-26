import { Router } from 'express';
import { store } from '../services/store.js';
const router = Router();
// Haversine Distance Formula in Kilometers
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}
// Category Compatibility Matrix
function getCategoryCompatibilityScore(reportCat, resType) {
    if (reportCat === 'Evacuation' && (resType === 'Transport' || resType === 'General'))
        return 50;
    if (reportCat === 'Medical' && resType === 'Medical')
        return 50;
    if (reportCat === 'Food & Water' && resType === 'Food & Water')
        return 50;
    if (reportCat === 'Shelter' && resType === 'Shelter')
        return 50;
    if (reportCat === 'Infrastructure' && (resType === 'General' || resType === 'Transport'))
        return 40;
    if (resType === 'General')
        return 25;
    return 15;
}
// POST /api/match - Calculate best volunteer resource match for an emergency report
router.post('/', (req, res) => {
    try {
        const { reportId } = req.body;
        if (!reportId) {
            return res.status(400).json({ success: false, error: 'Missing required field: reportId' });
        }
        const report = store.getReportById(reportId);
        if (!report) {
            return res.status(404).json({ success: false, error: 'Emergency report not found' });
        }
        const resources = store.getResources();
        // Filter available resources (or current assigned resource)
        const availableResources = resources.filter(r => r.status === 'Available' || r.id === report.assignedResourceId);
        if (availableResources.length === 0) {
            return res.json({ success: true, data: [], message: 'No available volunteer resources at this time.' });
        }
        const candidates = availableResources.map((resource) => {
            const distanceKm = haversineDistanceKm(report.location.lat, report.location.lng, resource.location.lat, resource.location.lng);
            const categoryScore = getCategoryCompatibilityScore(report.analysis.category, resource.type);
            const distanceScore = Math.max(0, 50 - distanceKm * 5); // Deduct 5 points per km distance
            const matchScore = Math.round(categoryScore + distanceScore);
            let matchRationale = `Near proximity (${distanceKm} km) with matching ${resource.type} capabilities.`;
            if (categoryScore >= 50) {
                matchRationale = `Optimal category match (${resource.type}) stationed ${distanceKm} km away.`;
            }
            return {
                resource,
                distanceKm,
                matchScore,
                matchRationale
            };
        });
        // Rank candidates by highest match score
        candidates.sort((a, b) => b.matchScore - a.matchScore);
        res.json({
            success: true,
            data: candidates,
            reportId: report.id,
            reportSummary: report.analysis.summary
        });
    }
    catch (error) {
        console.error('[AegisRelief Match] Error finding resource matches:', error);
        res.status(500).json({ success: false, error: 'Failed to calculate smart resource match' });
    }
});
// POST /api/match/assign - Assign resource to an emergency report
router.post('/assign', (req, res) => {
    try {
        const { reportId, resourceId } = req.body;
        if (!reportId || !resourceId) {
            return res.status(400).json({ success: false, error: 'Missing reportId or resourceId' });
        }
        const updated = store.updateReportStatus(reportId, 'Assigned', resourceId);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Report or resource not found' });
        }
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to assign resource' });
    }
});
// PUT /api/reports/:id/status - Update report status (Open -> Assigned -> Resolved)
router.put('/reports/:id/status', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Open', 'Assigned', 'Resolved'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status value' });
        }
        const updated = store.updateReportStatus(id, status);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update report status' });
    }
});
export default router;
