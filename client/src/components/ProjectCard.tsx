import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Project } from "@db/schema";
import { Github, Globe } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full"
        />
      </div>
      
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(project.technologies) && project.technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="gap-4">
        {project.link && (
          <Button asChild variant="outline" size="sm">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </Button>
        )}
        {project.githubLink && (
          <Button asChild variant="outline" size="sm">
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              Source Code
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
