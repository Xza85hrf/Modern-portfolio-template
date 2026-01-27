import { GoogleGenAI, Modality } from "@google/genai";
import "dotenv/config";

async function testImageGeneration() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY not set in .env");
    process.exit(1);
  }

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  console.log("Testing Gemini Image Generation");
  console.log("================================\n");

  // Test with gemini-2.5-flash-image (Nano Banana)
  const model = "gemini-2.5-flash-image";
  console.log(`Testing model: ${model}`);

  const prompt = `Create a simple abstract thumbnail for a software project.
Style: Dark theme, blue/purple gradients, geometric patterns, no text, 16:9 aspect ratio.`;

  console.log(`Prompt: ${prompt.slice(0, 50)}...`);
  console.log("\nSending request...\n");

  try {
    const startTime = Date.now();

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const elapsed = Date.now() - startTime;
    console.log(`Response received in ${elapsed}ms`);

    // Check response structure
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      console.log(`Candidate found with ${candidate.content?.parts?.length || 0} parts`);

      if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data && part.inlineData?.mimeType) {
            const mimeType = part.inlineData.mimeType;
            const dataSize = part.inlineData.data.length;
            console.log(`\nSUCCESS! Image generated:`);
            console.log(`  - MIME type: ${mimeType}`);
            console.log(`  - Base64 size: ${dataSize} chars (~${Math.round(dataSize * 0.75 / 1024)} KB)`);

            // Save to file for verification
            const fs = await import("fs");
            const buffer = Buffer.from(part.inlineData.data, "base64");
            fs.writeFileSync("test-generated-image.png", buffer);
            console.log(`  - Saved to: test-generated-image.png`);
            return;
          }
          if (part.text) {
            console.log(`Text response: ${part.text.slice(0, 100)}...`);
          }
        }
      }
    }

    console.log("No image in response. Full response:");
    console.log(JSON.stringify(response, null, 2).slice(0, 500));

  } catch (error: any) {
    console.error("\nERROR:", error.message || error);

    if (error.message?.includes("429") || error.message?.includes("quota")) {
      console.log("\n⚠️  Rate limited - wait for quota to reset (usually 1 minute for per-minute limits)");
    } else if (error.message?.includes("404")) {
      console.log("\n⚠️  Model not found - trying to list available models...");
      await listModels(client);
    }
  }
}

async function listModels(client: GoogleGenAI) {
  console.log("\nListing available models with 'image' in name:");
  const models = await client.models.list();
  for await (const model of models) {
    if (model.name?.toLowerCase().includes("image") ||
        model.displayName?.toLowerCase().includes("image")) {
      console.log(`  - ${model.name} (${model.displayName})`);
    }
  }
}

testImageGeneration();
