import { Router } from 'express';
import { store } from '../services/store.js';
const router = Router();
// GET /api/resources - Get all volunteer resources
router.get('/', (req, res) => {
    try {
        const resources = store.getResources();
        res.json({ success: true, data: resources });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch volunteer resources' });
    }
});
// POST /api/resources - Register a new volunteer resource
router.post('/', (req, res) => {
    try {
        const { name, type, capacity, address, lat, lng, contactPhone } = req.body;
        if (!name || !type || !contactPhone) {
            return res.status(400).json({ success: false, error: 'Missing required fields: name, type, contactPhone' });
        }
        const newResource = {
            id: `res-${Date.now()}`,
            name,
            type: type || 'General',
            capacity: capacity || 'Standard Unit',
            location: {
                lat: Number(lat) || 28.6139,
                lng: Number(lng) || 77.2090,
                address: address || 'New Delhi Relief Zone'
            },
            status: 'Available',
            contactPhone
        };
        const saved = store.addResource(newResource);
        res.status(201).json({ success: true, data: saved });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create volunteer resource' });
    }
});
export default router;
