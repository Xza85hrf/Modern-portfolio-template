import { GoogleGenAI, Modality } from "@google/genai";
import "dotenv/config";

const IMAGE_MODELS = [
  { name: "gemini-2.5-flash-image", method: "generateContent" },
  { name: "gemini-3-pro-image-preview", method: "generateContent" },
  { name: "nano-banana-pro-preview", method: "generateContent" },
];

async function testModel(client: GoogleGenAI, modelName: string): Promise<boolean> {
  console.log(`\nTesting: ${modelName}`);
  console.log("-".repeat(40));

  const prompt = "Create a simple dark blue abstract geometric thumbnail, no text, minimalist.";

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data) {
            const size = Math.round(part.inlineData.data.length * 0.75 / 1024);
            console.log(`SUCCESS! Generated ${size} KB image`);

            // Save test image
            const fs = await import("fs");
            const buffer = Buffer.from(part.inlineData.data, "base64");
            fs.writeFileSync(`test-${modelName.replace(/[\/\.]/g, "-")}.png`, buffer);
            console.log(`Saved to: test-${modelName.replace(/[\/\.]/g, "-")}.png`);
            return true;
          }
        }
      }
    }
    console.log("No image in response");
    return false;
  } catch (error: any) {
    const msg = error.message || String(error);
    if (msg.includes("429") || msg.includes("quota")) {
      console.log("RATE LIMITED - quota exhausted");
    } else if (msg.includes("404")) {
      console.log("MODEL NOT FOUND");
    } else {
      console.log(`ERROR: ${msg.slice(0, 100)}`);
    }
    return false;
  }
}

async function main() {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  console.log("Testing all image generation models");
  console.log("===================================");

  for (const model of IMAGE_MODELS) {
    const success = await testModel(client, model.name);
    if (success) {
      console.log(`\n✅ Working model found: ${model.name}`);
      break;
    }
    // Small delay between tests
    await new Promise(r => setTimeout(r, 1000));
  }
}

main();
