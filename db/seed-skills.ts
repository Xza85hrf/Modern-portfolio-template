/**
 * Seed script to populate skills from CV
 * Run with: npx tsx db/seed-skills.ts
 */

import dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import { skills } from "./schema";

const cvSkills = [
  // Infrastructure
  { name: "IT Support", category: "Infrastructure", proficiency: 95 },
  { name: "Linux", category: "Infrastructure", proficiency: 85 },
  { name: "Windows", category: "Infrastructure", proficiency: 90 },
  { name: "Networking", category: "Infrastructure", proficiency: 80 },

  // Development
  { name: "Python", category: "Development", proficiency: 90 },
  { name: "Scripting", category: "Development", proficiency: 88 },
  { name: "Programming", category: "Development", proficiency: 85 },
  { name: "FastAPI", category: "Development", proficiency: 80 },
  { name: "React", category: "Development", proficiency: 75 },

  // Tools
  { name: "Git / GitHub", category: "Tools", proficiency: 85 },
  { name: "Docker", category: "Tools", proficiency: 78 },
  { name: "MS Office", category: "Tools", proficiency: 90 },
  { name: "Raspberry Pi", category: "Tools", proficiency: 75 },

  // AI/ML
  { name: "AI/ML", category: "AI/ML", proficiency: 80 },
  { name: "Ollama", category: "AI/ML", proficiency: 85 },
  { name: "Vision AI", category: "AI/ML", proficiency: 75 },
  { name: "Image Processing", category: "AI/ML", proficiency: 70 },

  // Languages
  { name: "English (C1/C2)", category: "Languages", proficiency: 95 },
  { name: "Polish (B2)", category: "Languages", proficiency: 80 },
  { name: "Sinhala (Native)", category: "Languages", proficiency: 100 },
];

async function seedSkills() {
  console.log("Seeding skills from CV...\n");

  try {
    // Clear existing skills
    await db.delete(skills);
    console.log("Cleared existing skills");

    // Insert new skills
    for (const skill of cvSkills) {
      await db.insert(skills).values(skill);
      console.log(`  Added: ${skill.name} (${skill.category}) - ${skill.proficiency}%`);
    }

    console.log(`\nSuccessfully seeded ${cvSkills.length} skills!`);
  } catch (error) {
    console.error("Error seeding skills:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedSkills();
