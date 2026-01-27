import { generateImage, isGeminiConfigured } from "./gemini";
import { extractRepoInfo, getRepoImageUrl } from "./github";

interface ProjectData {
  title: string;
  description: string | null;
  technologies: string[] | null;
  githubLink: string | null;
}

/**
 * Extract key visual concepts from project description
 * Returns unique visual elements based on the actual project content
 */
function extractVisualConcepts(description: string): string[] {
  const concepts: string[] = [];
  const text = description.toLowerCase();

  // Domain-specific visual mappings - extract what the project DOES
  const visualMappings: Array<{ pattern: RegExp; visuals: string[] }> = [
    // File/Directory operations
    { pattern: /\b(directory|folder|file|path|structure|tree)\b/, visuals: ["nested folder hierarchies", "file tree visualization", "directory branching paths"] },
    { pattern: /\b(log|logging|record|track)\b/, visuals: ["scrolling log entries", "timestamp streams", "data recording visualization"] },

    // Image/Video processing
    { pattern: /\b(blur|filter|effect|image processing)\b/, visuals: ["layered image filters", "visual effect waves", "gradient transformations"] },
    { pattern: /\b(video|media|stream)\b/, visuals: ["video frames in sequence", "media player interface", "streaming data flow"] },
    { pattern: /\b(icon|image|picture|photo)\b/, visuals: ["floating image frames", "icon grid arrangement", "visual asset collection"] },

    // Audio/Speech
    { pattern: /\b(audio|sound|voice|speech|whisper|transcri)\b/, visuals: ["sound waveforms", "audio spectrum visualization", "speech bubbles transforming to text"] },
    { pattern: /\b(subtitle|caption|srt)\b/, visuals: ["text overlays on video frames", "caption timeline", "language text flowing"] },

    // Translation/Language
    { pattern: /\b(translat|language|multilingual)\b/, visuals: ["parallel text streams", "language transformation arrows", "multilingual text panels"] },

    // Database/Query
    { pattern: /\b(database|sql|query|qbe|table)\b/, visuals: ["database schema diagram", "query flow visualization", "connected data tables"] },
    { pattern: /\b(search|find|lookup)\b/, visuals: ["search magnifier with results", "data discovery paths", "filtering funnel"] },

    // ML/AI specific visualizations
    { pattern: /\b(neural|network|model|train)\b/, visuals: ["interconnected neural layers", "model architecture diagram", "training progress visualization"] },
    { pattern: /\b(predict|classif|recogni)\b/, visuals: ["input-to-output transformation", "classification categories", "recognition bounding boxes"] },
    { pattern: /\b(flag|country|nation)\b/, visuals: ["world map with flags", "flag grid collection", "geographic identification"] },

    // Hardware/Monitoring
    { pattern: /\b(gpu|graphics|cuda)\b/, visuals: ["graphics card with data streams", "parallel processing units", "GPU memory visualization"] },
    { pattern: /\b(cpu|processor|compute)\b/, visuals: ["processor chip with circuits", "compute cores diagram", "processing pipeline"] },
    { pattern: /\b(temperature|thermal|heat)\b/, visuals: ["temperature gauge", "thermal gradient display", "heat map visualization"] },
    { pattern: /\b(ups|power|battery|energy)\b/, visuals: ["power flow diagram", "battery status indicators", "energy management display"] },
    { pattern: /\b(raspberry|pi|embedded|iot)\b/, visuals: ["single-board computer", "GPIO pin connections", "embedded system layout"] },
    { pattern: /\b(sensor|monitor|real-time)\b/, visuals: ["live sensor readings", "real-time data dashboard", "monitoring graphs"] },

    // Web/UI
    { pattern: /\b(portfolio|website|web app)\b/, visuals: ["browser window mockup", "responsive device frames", "web page layout"] },
    { pattern: /\b(dashboard|panel|interface)\b/, visuals: ["control panel with widgets", "dashboard cards layout", "interactive UI elements"] },
    { pattern: /\b(gui|graphical|window)\b/, visuals: ["application window frames", "GUI component arrangement", "desktop interface"] },

    // Automation/Tools
    { pattern: /\b(automat|script|task|bot)\b/, visuals: ["automated workflow arrows", "task sequence diagram", "robot arm operations"] },
    { pattern: /\b(generat|creat|build|convert)\b/, visuals: ["transformation pipeline", "creation process stages", "output generation flow"] },
    { pattern: /\b(combin|merge|join)\b/, visuals: ["merging elements diagram", "combination visualization", "unified output result"] },

    // Data/Analytics
    { pattern: /\b(excel|spreadsheet|csv)\b/, visuals: ["spreadsheet cells grid", "data columns and rows", "chart from tabular data"] },
    { pattern: /\b(chart|graph|visualiz|analytics)\b/, visuals: ["data visualization charts", "analytics dashboard", "statistical graphs"] },
    { pattern: /\b(data|dataset|annotation|mask)\b/, visuals: ["data processing pipeline", "annotated data samples", "dataset visualization"] },

    // Library/Management
    { pattern: /\b(library|book|catalog|manage)\b/, visuals: ["organized shelves of items", "catalog card system", "management hierarchy"] },
    { pattern: /\b(user|account|login|auth)\b/, visuals: ["user profile cards", "authentication flow", "access control gates"] },

    // Streaming/Gaming
    { pattern: /\b(stream|gaming|play)\b/, visuals: ["streaming data connection", "game controller elements", "live broadcast visualization"] },
    { pattern: /\b(vpn|network|connect)\b/, visuals: ["secure tunnel visualization", "network topology", "encrypted connection paths"] },

    // Server/Backend
    { pattern: /\b(server|api|endpoint|backend)\b/, visuals: ["server rack infrastructure", "API connection diagram", "backend architecture"] },
    { pattern: /\b(docker|container|deploy)\b/, visuals: ["container boxes stacked", "deployment pipeline", "containerized services"] },
  ];

  // Find matching visual concepts from the description
  for (const mapping of visualMappings) {
    if (mapping.pattern.test(text)) {
      // Pick one visual randomly to add variety
      const visual = mapping.visuals[Math.floor(Math.random() * mapping.visuals.length)];
      if (!concepts.includes(visual)) {
        concepts.push(visual);
      }
    }
  }

  // Limit to 3 most relevant concepts for focused imagery
  return concepts.slice(0, 3);
}

/**
 * Generate a unique color palette based on project title hash
 * Ensures each project gets a distinct color scheme
 */
function generateColorPalette(title: string): { primary: string; secondary: string; accent: string } {
  // Create a hash from the title for deterministic but unique colors
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash) + title.charCodeAt(i);
    hash = hash & hash;
  }

  // Generate hue values spread across the color wheel
  const baseHue = Math.abs(hash) % 360;
  const secondaryHue = (baseHue + 45 + (Math.abs(hash >> 8) % 30)) % 360;

  // Predefined vibrant color palettes based on hue ranges
  const palettes = [
    { range: [0, 30], primary: "coral red (#FF6B6B)", secondary: "warm orange (#FFA07A)", accent: "golden yellow (#FFD93D)" },
    { range: [30, 60], primary: "amber (#F59E0B)", secondary: "golden (#EAB308)", accent: "warm white (#FEF3C7)" },
    { range: [60, 120], primary: "emerald (#10B981)", secondary: "lime (#84CC16)", accent: "mint (#D1FAE5)" },
    { range: [120, 180], primary: "teal (#14B8A6)", secondary: "cyan (#06B6D4)", accent: "aqua (#A5F3FC)" },
    { range: [180, 240], primary: "sky blue (#0EA5E9)", secondary: "indigo (#6366F1)", accent: "electric blue (#38BDF8)" },
    { range: [240, 300], primary: "purple (#8B5CF6)", secondary: "violet (#A855F7)", accent: "magenta (#E879F9)" },
    { range: [300, 360], primary: "pink (#EC4899)", secondary: "rose (#F43F5E)", accent: "fuchsia (#F0ABFC)" },
  ];

  const palette = palettes.find(p => baseHue >= p.range[0] && baseHue < p.range[1]) || palettes[0];
  return palette;
}

/**
 * Build a dynamic prompt for generating a unique project thumbnail
 * Based on the actual project description - no hardcoded categories
 */
export function buildProjectPrompt(project: ProjectData): string {
  const cleanTitle = project.title.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const description = project.description || project.title;
  const techStack = project.technologies?.slice(0, 3).join(", ") || "";

  // Extract visual concepts from description
  const visualConcepts = extractVisualConcepts(description);
  const colorPalette = generateColorPalette(project.title);

  // Build the visual scene description from extracted concepts
  const visualScene = visualConcepts.length > 0
    ? visualConcepts.join(", ")
    : "abstract software visualization with floating geometric shapes";

  // Create a condensed description for the prompt (max 150 chars)
  const shortDescription = description.length > 150
    ? description.substring(0, 147) + "..."
    : description;

  return `Create a unique isometric 3D illustration for "${cleanTitle}".

PROJECT DESCRIPTION:
${shortDescription}

VISUAL REPRESENTATION:
The image should visually represent the project's purpose through: ${visualScene}.
Create a scene that someone could look at and understand what this software does.

STYLE REQUIREMENTS:
- Isometric 3D perspective (30-degree angles)
- Modern, polished concept art style
- Dark background gradient (#0F172A to #1E293B)
- Primary color: ${colorPalette.primary}
- Secondary color: ${colorPalette.secondary}
- Accent highlights: ${colorPalette.accent}
- Soft volumetric lighting with glowing elements
- Clean, professional aesthetic

COMPOSITION:
- 16:9 landscape format
- Centered main subject with depth layers
- NO text, words, letters, or numbers
- NO generic tech symbols unless relevant to the description

${techStack ? `TECHNOLOGY CONTEXT: Built with ${techStack}` : ""}

Make this image UNIQUE and SPECIFIC to this exact project - it should not look like a generic tech illustration.`;
}

/**
 * Generate or fetch an image for a project with fallback chain:
 * 1. Gemini AI generation
 * 2. GitHub OpenGraph image (if project has GitHub link)
 * 3. Placeholder image
 */
export async function generateProjectImage(project: ProjectData): Promise<{
  image: string;
  source: "gemini" | "github" | "placeholder";
}> {
  // Try Gemini first if configured
  if (isGeminiConfigured()) {
    console.log(`Attempting Gemini image generation for: ${project.title}`);
    const prompt = buildProjectPrompt(project);
    const generatedImage = await generateImage(prompt);

    if (generatedImage) {
      console.log(`Successfully generated Gemini image for: ${project.title}`);
      return {
        image: generatedImage,
        source: "gemini",
      };
    }
    console.log(`Gemini generation failed for: ${project.title}, falling back`);
  }

  // Fallback to GitHub OpenGraph image
  if (project.githubLink) {
    try {
      const { owner, repo } = await extractRepoInfo(project.githubLink);
      const githubImage = getRepoImageUrl(owner, repo);
      console.log(`Using GitHub OpenGraph image for: ${project.title}`);
      return {
        image: githubImage,
        source: "github",
      };
    } catch (error) {
      console.log(`Failed to extract GitHub repo info for: ${project.title}`);
    }
  }

  // Final fallback: placeholder image
  console.log(`Using placeholder image for: ${project.title}`);
  return {
    image: generatePlaceholderImage(project.title),
    source: "placeholder",
  };
}

/**
 * Generate a simple SVG placeholder image
 */
function generatePlaceholderImage(title: string): string {
  // Create a deterministic color based on title
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue}, 70%, 15%)"/>
        <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360}, 70%, 25%)"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>
    <rect width="1200" height="675" fill="url(#grid)"/>
    <circle cx="600" cy="337" r="120" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <circle cx="600" cy="337" r="80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <circle cx="600" cy="337" r="40" fill="rgba(255,255,255,0.1)"/>
  </svg>`;

  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Check if Gemini image generation is available
 */
export function isImageGenerationAvailable(): boolean {
  return isGeminiConfigured();
}
