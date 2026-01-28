import { memo, useState } from "react";
import { Github, ExternalLink, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/layout/GlassCard";
import { type Project } from "@db/schema";
import { cn } from "@/lib/utils";

interface ProjectCard3DProps {
  project: Project;
  onViewDetails?: (project: Project) => void;
}

export const ProjectCard3D = memo(function ProjectCard3D({ project, onViewDetails }: ProjectCard3DProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasImage = project.image && !imageError;

  return (
    <GlassCard
      variant="elevated"
      hover={true}
      className="h-full flex flex-col overflow-hidden group"
    >
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden">
          {hasImage ? (
            <>
              {/* Loading skeleton */}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              <img
                src={project.image}
                alt={`Screenshot of ${project.title} project`}
                loading="lazy"
                width={400}
                height={225}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isImageLoaded ? "opacity-100" : "opacity-0",
                  "group-hover:scale-105"
                )}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            // Gradient placeholder
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary/20">
                {project.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Tech badge overlay */}
          <div className="absolute top-3 right-3 flex gap-1">
            {project.technologies?.slice(0, 2).map((tech) => (
              <Badge
                key={tech}
                className="bg-background/80 backdrop-blur-sm text-xs border-0"
              >
                {tech}
              </Badge>
            ))}
            {(project.technologies?.length || 0) > 2 && (
              <Badge className="bg-background/80 backdrop-blur-sm text-xs border-0">
                +{(project.technologies?.length || 0) - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded-md bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-border/50">
            {/* View Details Button - Always visible */}
            <Button
              size="sm"
              variant="default"
              className="flex-1"
              onClick={() => onViewDetails?.(project)}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View Details
            </Button>

            {/* External Links */}
            {project.link && (
              <Button
                size="sm"
                variant="outline"
                className="px-2"
                asChild
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live Demo"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.githubLink && (
              <Button
                size="sm"
                variant="outline"
                className="px-2"
                asChild
              >
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Source Code"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
  );
});

export default ProjectCard3D;
