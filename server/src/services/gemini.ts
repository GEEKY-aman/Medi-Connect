
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseRecommendation, Hospital } from "../types";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export async function predictDisease(symptoms: string[]): Promise<DiseaseRecommendation> {
    const prompt = `Based on these symptoms: ${symptoms.join(", ")}, provide a potential medical analysis. 
  Include predicted disease, confidence level, suggested lifestyle changes, possible over-the-counter medicines (with a disclaimer), and precautions.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        disease: { type: Type.STRING },
                        confidence: { type: Type.NUMBER },
                        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        medicines: { type: Type.ARRAY, items: { type: Type.STRING } },
                        precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        urgency: { type: Type.STRING, description: 'LOW, MEDIUM, or HIGH' }
                    },
                    required: ["disease", "confidence", "suggestions", "medicines", "precautions", "urgency"]
                }
            }
        });

        if (response && response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("Empty response from AI");

    } catch (e) {
        console.error("Failed to parse AI response", e);
        throw new Error("AI Recommendation failed.");
    }
}

export async function findNearbyHospitals(query?: string, location?: { lat: number, lng: number }): Promise<Hospital[]> {
    let locationContext = "";
    if (query) {
        locationContext = `in or near ${query}`;
    } else if (location) {
        locationContext = `at latitude ${location.lat}, longitude ${location.lng}`;
    } else {
        locationContext = "near my current location";
    }

    const prompt = `Find 5 hospitals and medical clinics ${locationContext}. Provide their names and addresses.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: location ? { latitude: location.lat, longitude: location.lng } : undefined
                    }
                }
            }
        });

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const hospitals: Hospital[] = chunks
            .filter((chunk: any) => chunk.maps)
            .map((chunk: any) => ({
                name: chunk.maps.title || "Hospital",
                address: chunk.maps.uri || "",
                uri: chunk.maps.uri
            }));

        return hospitals;

    } catch (e) {
        console.error("Failed to fetch hospitals", e);
        throw new Error("Hospital search failed");
    }
}
