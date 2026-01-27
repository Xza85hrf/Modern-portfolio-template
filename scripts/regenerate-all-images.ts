import { buildProjectPrompt } from "../server/lib/image-generation";
import { GoogleGenAI, Modality } from "@google/genai";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

interface Project {
  id: number;
  title: string;
  description: string | null;
  technologies: string[] | null;
  github_link: string | null;
}

async function main() {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log("🔄 Regenerating all project images with new description-based prompts\n");
  console.log("=".repeat(70));

  // Fetch all projects
  const result = await pool.query<Project>(
    "SELECT id, title, description, technologies, github_link FROM projects ORDER BY id"
  );
  const projects = result.rows;

  console.log(`Found ${projects.length} projects to regenerate\n`);

  let success = 0;
  let failed = 0;

  for (const project of projects) {
    console.log(`\n[${project.id}] ${project.title}`);
    console.log("-".repeat(50));

    const projectData = {
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      githubLink: project.github_link,
    };

    const prompt = buildProjectPrompt(projectData);

    // Show what visual concepts were extracted
    const visualMatch = prompt.match(/purpose through: (.*?)\.\nCreate/);
    if (visualMatch) {
      console.log(`Visual concepts: ${visualMatch[1]}`);
    }

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
            if (part.inlineData?.data && part.inlineData?.mimeType) {
              const mimeType = part.inlineData.mimeType;
              const base64Data = part.inlineData.data;
              const dataUrl = `data:${mimeType};base64,${base64Data}`;
              const size = Math.round(base64Data.length * 0.75 / 1024);

              // Update database
              await pool.query(
                "UPDATE projects SET image = $1 WHERE id = $2",
                [dataUrl, project.id]
              );

              console.log(`✅ Generated ${size} KB image - saved to database`);
              success++;
              break;
            }
          }
        }
      }
    } catch (error: any) {
      const msg = error.message || String(error);
      if (msg.includes("429") || msg.includes("quota")) {
        console.log("⚠️ RATE LIMITED - waiting 60 seconds...");
        await new Promise(resolve => setTimeout(resolve, 60000));
        // Retry this project
        try {
          const retryResponse = await client.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: {
              responseModalities: [Modality.IMAGE],
            },
          });
          if (retryResponse.candidates?.[0]?.content?.parts) {
            for (const part of retryResponse.candidates[0].content.parts) {
              if (part.inlineData?.data && part.inlineData?.mimeType) {
                const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                await pool.query("UPDATE projects SET image = $1 WHERE id = $2", [dataUrl, project.id]);
                console.log(`✅ Retry succeeded`);
                success++;
                break;
              }
            }
          }
        } catch {
          console.log("❌ Retry also failed");
          failed++;
        }
      } else {
        console.log(`❌ ERROR: ${msg.slice(0, 100)}`);
        failed++;
      }
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n" + "=".repeat(70));
  console.log(`\n✅ Successfully regenerated: ${success} images`);
  console.log(`❌ Failed: ${failed} images`);

  await pool.end();
}

main().catch(console.error);
