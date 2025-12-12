import { GoogleGenAI } from "@google/genai";
import { ETHEREAL_PROMPT } from "../constants";

export const generateEtherealImage = async (base64Image: string, mimeType: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Using gemini-2.5-flash-image as it's efficient for image editing/transformations
  const modelName = 'gemini-2.5-flash-image'; 

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: ETHEREAL_PROMPT,
          },
        ],
      },
    });

    // Iterate through parts to find the image output
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Construct a displayable Data URL
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let message = error.message || "Failed to generate image.";

    // Attempt to parse JSON error responses from the API
    if (typeof message === 'string' && message.trim().startsWith('{')) {
      try {
        const jsonError = JSON.parse(message);
        if (jsonError.error && jsonError.error.message) {
          message = jsonError.error.message;
        }
      } catch (e) {
        // Fallback to original message if parsing fails
      }
    }
    
    // Normalize API key errors
    if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
      message = "Invalid API Key. Please check your environment configuration.";
    }

    throw new Error(message);
  }
};