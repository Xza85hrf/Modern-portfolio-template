import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function listAllModels() {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  console.log("All available models:");
  console.log("=====================\n");

  const models = await client.models.list();
  const modelList: any[] = [];

  for await (const model of models) {
    modelList.push({
      name: model.name,
      displayName: model.displayName,
      methods: model.supportedActions,
    });
  }

  // Sort and display
  modelList.sort((a, b) => a.name.localeCompare(b.name));

  for (const m of modelList) {
    console.log(`${m.name}`);
    console.log(`  Display: ${m.displayName}`);
    console.log(`  Methods: ${m.methods?.join(", ") || "N/A"}`);
    console.log("");
  }

  // Filter for image-related
  console.log("\n\nImage-related models:");
  console.log("=====================");
  for (const m of modelList) {
    const nameL = (m.name + m.displayName).toLowerCase();
    if (nameL.includes("image") || nameL.includes("imagen") || nameL.includes("vision")) {
      console.log(`${m.name} - ${m.displayName}`);
    }
  }
}

listAllModels();
