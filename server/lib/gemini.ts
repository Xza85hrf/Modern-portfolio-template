import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini client (lazy initialization)
let genAI: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Generate an image using Gemini Nano Banana (gemini-2.5-flash-image) model
 * @param prompt - The image generation prompt
 * @param timeoutMs - Timeout in milliseconds (default: 30000)
 * @returns Base64-encoded image data URL or null on failure
 */
export async function generateImage(
  prompt: string,
  timeoutMs: number = 30000
): Promise<string | null> {
  const client = getGenAI();
  if (!client) {
    console.log("Gemini API key not configured, skipping image generation");
    return null;
  }

  try {
    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Gemini API request timed out")), timeoutMs);
    });

    // Generate image using Gemini Nano Banana (2.5 Flash Image) model
    const generatePromise = client.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    // Extract image from response parts
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data && part.inlineData?.mimeType) {
            const mimeType = part.inlineData.mimeType;
            const base64Data = part.inlineData.data;
            return `data:${mimeType};base64,${base64Data}`;
          }
        }
      }
    }

    console.log("Gemini response did not contain an image");
    return null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("timed out")) {
        console.error("Gemini image generation timed out after", timeoutMs, "ms");
      } else if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("RESOURCE_EXHAUSTED")) {
        console.error("Gemini API rate limited:", error.message);
      } else if (error.message.includes("400") || error.message.includes("INVALID_ARGUMENT")) {
        console.error("Gemini prompt rejected (safety filters or invalid):", error.message);
      } else if (error.message.includes("404") || error.message.includes("NOT_FOUND")) {
        console.error("Gemini model not found - trying fallback model");
        // Could add fallback to another model here
      } else {
        console.error("Gemini image generation failed:", error.message);
      }
    } else {
      console.error("Gemini image generation failed with unknown error");
    }
    return null;
  }
}
