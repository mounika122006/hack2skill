import { GoogleGenAI } from '@google/genai';
const SYSTEM_INSTRUCTION = `You are AegisRelief AI, an emergency triage assistant for natural disaster response.
Analyze incoming citizen SOS reports (text and optional photo) and categorize them for volunteer dispatch.

CRITICAL CONSTRAINTS:
1. Provide immediate, non-clinical safety guidance for citizens. Do NOT make medical diagnoses or prescribe medical treatment.
2. Prioritize life-safety emergencies (flash floods, trapped citizens, active hazards) as Critical or High urgency.
3. Be concise and precise in the summary and requested resources list.
4. Output MUST conform strictly to the specified JSON schema.`;
// Heuristic fallback for server resilience if API key is unconfigured or quota/network fails
function getFallbackAnalysis(rawText, imagePresent) {
    const textLower = rawText.toLowerCase();
    let category = 'Other';
    let urgency = 'Medium';
    let requestedResources = ['General Volunteer Squad'];
    if (textLower.includes('flood') || textLower.includes('trap') || textLower.includes('evacuat') || textLower.includes('boat') || textLower.includes('water rising')) {
        category = 'Evacuation';
        urgency = 'Critical';
        requestedResources = ['Rescue Boat', 'Evacuation Squad', 'Life Jackets'];
    }
    else if (textLower.includes('injur') || textLower.includes('bleed') || textLower.includes('pain') || textLower.includes('doctor') || textLower.includes('medic')) {
        category = 'Medical';
        urgency = 'High';
        requestedResources = ['Paramedic Unit', 'First Aid Kit'];
    }
    else if (textLower.includes('food') || textLower.includes('water') || textLower.includes('drink') || textLower.includes('starv')) {
        category = 'Food & Water';
        urgency = 'Medium';
        requestedResources = ['Clean Drinking Water', 'Ration Packs'];
    }
    else if (textLower.includes('roof') || textLower.includes('shelter') || textLower.includes('home') || textLower.includes('house')) {
        category = 'Shelter';
        urgency = 'High';
        requestedResources = ['Emergency Shelter Beds', 'Tarps & Blankets'];
    }
    else if (textLower.includes('power') || textLower.includes('wire') || textLower.includes('road') || textLower.includes('bridge')) {
        category = 'Infrastructure';
        urgency = 'High';
        requestedResources = ['Utility Repair Crew', 'Safety Barricades'];
    }
    return {
        category,
        urgency,
        summary: rawText.length > 120 ? rawText.substring(0, 117) + '...' : rawText,
        requestedResources,
        safetyRecommendations: [
            'If in immediate physical danger, evacuate to high ground or a safe structural area.',
            'Do not attempt to cross flooded roadways or touch submerged electrical cables.',
            'AI triage is for emergency prioritization assistance only. Always follow official disaster directives.'
        ],
        confidenceScore: 0.75
    };
}
export async function triageEmergencyReport(rawText, imageBase64) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
        console.warn('[AegisRelief Gemini] GEMINI_API_KEY not configured. Utilizing heuristic fallback triage.');
        return getFallbackAnalysis(rawText, !!imageBase64);
    }
    try {
        const ai = new GoogleGenAI({ apiKey });
        const contents = [];
        // Attach base64 image if present
        if (imageBase64) {
            // Strip data URL prefix if present (e.g. data:image/png;base64,)
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            contents.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                }
            });
        }
        contents.push({
            text: `Analyze this citizen emergency report:\n\nReport Details: "${rawText}"`
        });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        category: {
                            type: 'STRING',
                            enum: ['Medical', 'Evacuation', 'Food & Water', 'Shelter', 'Infrastructure', 'Other']
                        },
                        urgency: {
                            type: 'STRING',
                            enum: ['Critical', 'High', 'Medium', 'Low']
                        },
                        summary: { type: 'STRING' },
                        requestedResources: {
                            type: 'ARRAY',
                            items: { type: 'STRING' }
                        },
                        safetyRecommendations: {
                            type: 'ARRAY',
                            items: { type: 'STRING' }
                        },
                        confidenceScore: { type: 'NUMBER' }
                    },
                    required: [
                        'category',
                        'urgency',
                        'summary',
                        'requestedResources',
                        'safetyRecommendations',
                        'confidenceScore'
                    ]
                }
            }
        });
        const responseText = response.text;
        if (!responseText) {
            throw new Error('Empty response received from Gemini API');
        }
        const parsed = JSON.parse(responseText);
        // Ensure mandatory disclaimer is always present in safety recommendations
        const disclaimer = 'AI triage is for emergency prioritization assistance only. Always follow official disaster response directives.';
        if (!parsed.safetyRecommendations.some(s => s.includes('AI triage is for emergency'))) {
            parsed.safetyRecommendations.push(disclaimer);
        }
        return parsed;
    }
    catch (error) {
        console.error('[AegisRelief Gemini] Error during Gemini triage generation:', error?.message || error);
        return getFallbackAnalysis(rawText, !!imageBase64);
    }
}
