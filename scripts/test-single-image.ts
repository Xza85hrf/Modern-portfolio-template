import { buildProjectPrompt } from "../server/lib/image-generation";
import { GoogleGenAI, Modality } from "@google/genai";
import "dotenv/config";
import * as fs from "fs";

const testProject = {
  title: "Directory Logger",
  description: "Directory Logger is a powerful and flexible tool for generating detailed logs of directory structures and file metadata. It offers both a command-line interface and a graphical user interface.",
  technologies: ["Python"],
  githubLink: null,
};

async function main() {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  console.log("Testing new description-based image generation\n");
  console.log(`Project: ${testProject.title}`);
  console.log("-".repeat(50));

  const prompt = buildProjectPrompt(testProject);
  console.log("\nGenerated Prompt:\n");
  console.log(prompt);
  console.log("\n" + "-".repeat(50));
  console.log("\nGenerating image...\n");

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-image",
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
            console.log(`✅ SUCCESS! Generated ${size} KB image`);

            // Save test image
            const buffer = Buffer.from(part.inlineData.data, "base64");
            const filename = `test-directory-logger-new.png`;
            fs.writeFileSync(filename, buffer);
            console.log(`Saved to: ${filename}`);
            return;
          }
        }
      }
    }
    console.log("❌ No image in response");
  } catch (error: any) {
    const msg = error.message || String(error);
    if (msg.includes("429") || msg.includes("quota")) {
      console.log("⚠️ RATE LIMITED - quota exhausted, try again later");
    } else {
      console.log(`❌ ERROR: ${msg.slice(0, 200)}`);
    }
  }
}

main();
