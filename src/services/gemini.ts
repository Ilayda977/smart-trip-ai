import type { TripPlan } from "../types/travel";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateTrip(
  city: string,
  days: number,
  mode: string
): Promise<TripPlan> {
  const prompt = `
    You are a travel expert. Create a ${days}-day travel plan for ${city}.
    Travel style: ${mode}
    
    Return ONLY a JSON object, no extra text:
    {
      "city": "${city}",
      "days": [
        {
          "day": 1,
          "activities": [
            {
              "time": "09:00",
              "place": "Place name",
              "description": "Short description",
              "emoji": "🗺️",
              "visited": false
            }
          ]
        }
      ]
    }
    
    Each day should have 4-5 activities. Match the style: ${mode}.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
