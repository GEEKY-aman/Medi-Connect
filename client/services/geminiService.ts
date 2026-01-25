
import { DiseaseRecommendation, Hospital } from "../types";

// Base URL not needed if using proxy, but good to have configurable
const API_BASE_URL = '/api';

export async function predictDisease(symptoms: string[]): Promise<DiseaseRecommendation> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict-disease`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch prediction");
    }

    return await response.json();
  } catch (e) {
    console.error("AI Prediction failed", e);
    throw new Error("AI Recommendation failed.");
  }
}

export async function findNearbyHospitals(query?: string, location?: { lat: number, lng: number }): Promise<Hospital[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, location }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch hospitals");
    }

    return await response.json();
  } catch (e) {
    console.error("Hospital search failed", e);
    throw new Error("Hospital search failed.");
  }
}
