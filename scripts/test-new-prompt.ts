import { buildProjectPrompt } from "../server/lib/image-generation";

// Test the new description-based prompt generator with different project types
const testProjects = [
  {
    title: "Directory Logger",
    description: "Directory Logger is a powerful and flexible tool for generating detailed logs of directory structures and file metadata. It offers both a command-line interface and a graphical user interface.",
    technologies: ["Python"],
    githubLink: null,
  },
  {
    title: "Whisper Subtitle Generator",
    description: "The Whisper Subtitle Generator leverages OpenAI's Whisper model to generate subtitles from audio and video files. This Python-based tool supports multiple languages and employs advanced audio processing techniques.",
    technologies: ["Python", "Whisper", "FFmpeg"],
    githubLink: null,
  },
  {
    title: "Raspberry Pi Temperature Monitor",
    description: "The Temperature Monitor is a C program for Raspberry Pi 5 and 4B that monitors and logs system temperature in real-time. It features threshold-based logging, automatic log rotation, and daemon mode.",
    technologies: ["C", "Raspberry Pi"],
    githubLink: null,
  },
  {
    title: "Flag Prediction Project",
    description: "This application predicts the name of a country based on an input flag image. It uses advanced image processing techniques and deep learning models built with PyTorch to classify flags accurately.",
    technologies: ["Python", "PyTorch"],
    githubLink: null,
  },
  {
    title: "TaskBot",
    description: "TaskBot is a task automation tool with a graphical user interface (GUI) for executing scripted actions.",
    technologies: ["Python"],
    githubLink: null,
  },
  {
    title: "COCO Annotation Mask Generator",
    description: "Python script generates colored masks from COCO-style annotations. It reads the COCO annotation files, creates masks for each annotation, colors the masks based on the annotation's category.",
    technologies: ["Python"],
    githubLink: null,
  },
  {
    title: "Online Library Django",
    description: "An extensive online library management system. The application enables comprehensive management of library resources, users and loan processes.",
    technologies: ["Python", "Django", "HTML", "CSS"],
    githubLink: null,
  },
  {
    title: "SmartUPS",
    description: "Smart, real-time UPS monitoring solution for Raspberry Pi, providing detailed system insights and power management using the Waveshare UPS Module 3S.",
    technologies: ["Python"],
    githubLink: null,
  },
];

console.log("Testing Description-Based Prompt Generator\n");
console.log("=".repeat(70) + "\n");

for (const project of testProjects) {
  console.log(`\n📦 Project: ${project.title}`);
  console.log("-".repeat(50));
  const prompt = buildProjectPrompt(project);

  // Extract key parts of the prompt to show
  const visualMatch = prompt.match(/VISUAL REPRESENTATION:\n(.*?)\n\nSTYLE/s);
  const colorMatch = prompt.match(/Primary color: (.*?)\n/);

  if (visualMatch) {
    console.log(`🎨 Visual: ${visualMatch[1].trim()}`);
  }
  if (colorMatch) {
    console.log(`🎨 Color: ${colorMatch[1]}`);
  }
  console.log("\n" + "=".repeat(70));
}

// Show one full prompt as example
console.log("\n\n📝 FULL PROMPT EXAMPLE (Directory Logger):\n");
console.log("-".repeat(70));
console.log(buildProjectPrompt(testProjects[0]));
