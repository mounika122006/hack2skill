// In-Memory Data Storage with Initial Demo Seed Data
class DataStore {
    constructor() {
        this.reports = [
            {
                id: 'rep-101',
                createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
                rawText: 'Severe flash flooding in living room. Elderly grandmother needs immediate boat evacuation, water rising rapidly.',
                imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
                location: {
                    lat: 28.6139,
                    lng: 77.2090,
                    address: '14 Riverview Colony, Sector 4, New Delhi'
                },
                analysis: {
                    category: 'Evacuation',
                    urgency: 'Critical',
                    summary: 'Elderly citizen trapped in flash flood requiring urgent boat evacuation.',
                    requestedResources: ['Rescue Boat', 'Paramedic Unit', 'Life Jackets'],
                    safetyRecommendations: [
                        'Move grandmother to top floor or rooftop immediately.',
                        'Do not touch electrical outlets or submerged appliances.',
                        'Signal rescue teams with bright cloth or flashlight.',
                        'AI triage is for emergency prioritization assistance only. Always follow official disaster response directives.'
                    ],
                    confidenceScore: 0.96
                },
                status: 'Open'
            },
            {
                id: 'rep-102',
                createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
                rawText: 'Power line down across main road block near community center. Sparking wires near standing water.',
                location: {
                    lat: 28.6219,
                    lng: 77.2140,
                    address: 'Main Gate, Central Community Park, New Delhi'
                },
                analysis: {
                    category: 'Infrastructure',
                    urgency: 'High',
                    summary: 'Exposed live power line near floodwater posing electrical hazard.',
                    requestedResources: ['Utility Repair Crew', 'Police Safety Barricade'],
                    safetyRecommendations: [
                        'Maintain at least 30 feet distance from sparking line.',
                        'Warn pedestrians and divert oncoming vehicular traffic.',
                        'AI triage is for emergency prioritization assistance only. Always follow official disaster response directives.'
                    ],
                    confidenceScore: 0.92
                },
                status: 'Open'
            },
            {
                id: 'rep-103',
                createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
                rawText: '25 displaced family members need clean drinking water, infant formula, and warm blankets at temporary shelter point.',
                location: {
                    lat: 28.6080,
                    lng: 77.2210,
                    address: 'St. Marks High School Gym Relief Camp, New Delhi'
                },
                analysis: {
                    category: 'Food & Water',
                    urgency: 'Medium',
                    summary: 'Displaced families at relief camp requiring clean water and infant supplies.',
                    requestedResources: ['Clean Drinking Water Cans', 'Infant Formula', 'Thermal Blankets'],
                    safetyRecommendations: [
                        'Ensure water distribution is rationed fairly.',
                        'Keep dry sleeping areas separate from ration storage.',
                        'AI triage is for emergency prioritization assistance only. Always follow official disaster response directives.'
                    ],
                    confidenceScore: 0.89
                },
                status: 'Assigned',
                assignedResourceId: 'res-3',
                assignedResourceName: 'Capital Food & Water Relief Truck'
            },
            {
                id: 'rep-104',
                createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
                rawText: 'Minor leg injury during debris clearance. Requires basic wound cleaning and tetanus shot.',
                location: {
                    lat: 28.6280,
                    lng: 77.2020,
                    address: '88 West Patel Nagar, Block B, New Delhi'
                },
                analysis: {
                    category: 'Medical',
                    urgency: 'Low',
                    summary: 'Non-critical leg cut needing basic first aid treatment.',
                    requestedResources: ['First Aid Kit', 'Tetanus Vaccination'],
                    safetyRecommendations: [
                        'Clean wound with clean running water and apply clean bandage.',
                        'Keep leg elevated to reduce swelling.',
                        'AI triage is for emergency prioritization assistance only. Always follow official disaster response directives.'
                    ],
                    confidenceScore: 0.85
                },
                status: 'Resolved',
                assignedResourceId: 'res-2',
                assignedResourceName: 'Red Cross First Aid Mobile Unit'
            },
            {
                id: 'rep-105',
                createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
                rawText: 'Storm damaged apartment building roof. 4 families seeking emergency temporary shelter tonight.',
                location: {
                    lat: 28.6180,
                    lng: 77.2300,
                    address: 'Sunrise Apartments, Connaught Outer Ring, New Delhi'
                },
                analysis: {
                    category: 'Shelter',
                    urgency: 'High',
                    summary: '4 families left homeless due to structural storm damage to apartment roof.',
                    requestedResources: ['Emergency Shelter Beds', 'Temporary Tarp Cover'],
                    safetyRecommendations: [
                        'Evacuate building immediately due to structural roof risk.',
                        'Wait at designated safe assembly area outside.',
                        'AI triage is for emergency prioritization assistance only. Always follow official disaster response directives.'
                    ],
                    confidenceScore: 0.91
                },
                status: 'Open'
            }
        ];
        this.resources = [
            {
                id: 'res-1',
                name: 'Rapid Disaster Rescue Boat Unit A',
                type: 'Transport',
                capacity: '2 Inflatable Boats, 6 Life Jackets, 3 Crew',
                location: {
                    lat: 28.6150,
                    lng: 77.2110,
                    address: 'Fire Station 4, Lodhi Road, New Delhi'
                },
                status: 'Available',
                contactPhone: '+91 98765 43210'
            },
            {
                id: 'res-2',
                name: 'Red Cross First Aid Mobile Unit',
                type: 'Medical',
                capacity: '2 Paramedics, Full Trauma & First Aid Kit',
                location: {
                    lat: 28.6250,
                    lng: 77.2050,
                    address: 'Patel Nagar Medical Center, New Delhi'
                },
                status: 'Available',
                contactPhone: '+91 98765 43211'
            },
            {
                id: 'res-3',
                name: 'Capital Food & Water Relief Truck',
                type: 'Food & Water',
                capacity: '500L Bottled Water, 200 Ration Packs',
                location: {
                    lat: 28.6100,
                    lng: 77.2250,
                    address: 'Central Community Logistics Hub, New Delhi'
                },
                status: 'Busy',
                contactPhone: '+91 98765 43212'
            },
            {
                id: 'res-4',
                name: 'St. Jude Emergency Relief Shelter',
                type: 'Shelter',
                capacity: '40 Available Cots, Heated Hall, Kitchen Facilities',
                location: {
                    lat: 28.6190,
                    lng: 77.2350,
                    address: 'St. Jude Auditorium, Barakhamba Road, New Delhi'
                },
                status: 'Available',
                contactPhone: '+91 98765 43213'
            }
        ];
    }
    getReports() {
        return this.reports;
    }
    getReportById(id) {
        return this.reports.find(r => r.id === id);
    }
    addReport(report) {
        this.reports.unshift(report);
        return report;
    }
    updateReportStatus(id, status, resourceId) {
        const report = this.reports.find(r => r.id === id);
        if (!report)
            return undefined;
        report.status = status;
        if (resourceId) {
            const resource = this.resources.find(res => res.id === resourceId);
            if (resource) {
                report.assignedResourceId = resource.id;
                report.assignedResourceName = resource.name;
                if (status === 'Assigned') {
                    resource.status = 'Busy';
                }
            }
        }
        else if (status === 'Resolved' && report.assignedResourceId) {
            // Free up resource if report is resolved
            const resource = this.resources.find(res => res.id === report.assignedResourceId);
            if (resource) {
                resource.status = 'Available';
            }
        }
        return report;
    }
    getResources() {
        return this.resources;
    }
    addResource(resource) {
        this.resources.unshift(resource);
        return resource;
    }
    updateResourceStatus(id, status) {
        const res = this.resources.find(r => r.id === id);
        if (res) {
            res.status = status;
        }
        return res;
    }
    getMetrics() {
        const totalReports = this.reports.length;
        const criticalReports = this.reports.filter(r => r.analysis.urgency === 'Critical' && r.status !== 'Resolved').length;
        const resolvedReports = this.reports.filter(r => r.status === 'Resolved').length;
        const availableResources = this.resources.filter(r => r.status === 'Available').length;
        return {
            totalReports,
            criticalReports,
            resolvedReports,
            availableResources
        };
    }
}
export const store = new DataStore();
