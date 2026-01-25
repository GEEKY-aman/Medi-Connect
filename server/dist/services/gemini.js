"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictDisease = predictDisease;
exports.findNearbyHospitals = findNearbyHospitals;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
}
const ai = new genai_1.GoogleGenAI({ apiKey: apiKey });
function predictDisease(symptoms) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Based on these symptoms: ${symptoms.join(", ")}, provide a potential medical analysis. 
  Include predicted disease, confidence level, suggested lifestyle changes, possible over-the-counter medicines (with a disclaimer), and precautions.`;
        try {
            const response = yield ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: genai_1.Type.OBJECT,
                        properties: {
                            disease: { type: genai_1.Type.STRING },
                            confidence: { type: genai_1.Type.NUMBER },
                            suggestions: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                            medicines: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                            precautions: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING } },
                            urgency: { type: genai_1.Type.STRING, description: 'LOW, MEDIUM, or HIGH' }
                        },
                        required: ["disease", "confidence", "suggestions", "medicines", "precautions", "urgency"]
                    }
                }
            });
            if (response && response.text) {
                return JSON.parse(response.text);
            }
            throw new Error("Empty response from AI");
        }
        catch (e) {
            console.error("Failed to parse AI response", e);
            throw new Error("AI Recommendation failed.");
        }
    });
}
function findNearbyHospitals(query, location) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        let locationContext = "";
        if (query) {
            locationContext = `in or near ${query}`;
        }
        else if (location) {
            locationContext = `at latitude ${location.lat}, longitude ${location.lng}`;
        }
        else {
            locationContext = "near my current location";
        }
        const prompt = `Find 5 hospitals and medical clinics ${locationContext}. Provide their names and addresses.`;
        try {
            const response = yield ai.models.generateContent({
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
            const chunks = ((_c = (_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.groundingMetadata) === null || _c === void 0 ? void 0 : _c.groundingChunks) || [];
            const hospitals = chunks
                .filter((chunk) => chunk.maps)
                .map((chunk) => ({
                name: chunk.maps.title || "Hospital",
                address: chunk.maps.uri || "",
                uri: chunk.maps.uri
            }));
            return hospitals;
        }
        catch (e) {
            console.error("Failed to fetch hospitals", e);
            throw new Error("Hospital search failed");
        }
    });
}
