import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Project, insertProjectSchema } from "@db/schema";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Github, RefreshCw, Wand2, ImageIcon, Pencil, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { type InsertProject } from "@db/schema";

type ProjectFormData = Omit<
  InsertProject,
  "id" | "createdAt" | "updatedAt" | "metadata"
> & {
  technologies: string[];
};

export default function Projects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [inlineEditId, setInlineEditId] = useState<number | null>(null);
  const [inlineEditTitle, setInlineEditTitle] = useState("");
  const inlineInputRef = useRef<HTMLInputElement>(null);

  // Focus input when inline editing starts
  useEffect(() => {
    if (inlineEditId && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [inlineEditId]);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => apiGet<Project[]>("/api/projects"),
  });

  // Check if AI image generation is available
  const { data: imageGenStatus } = useQuery<{ available: boolean; provider: string | null }>({
    queryKey: ["image-generation-status"],
    queryFn: () => apiGet<{ available: boolean; provider: string | null }>("/api/image-generation/status"),
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      technologies: [],
      link: null,
      githubLink: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      return apiPost("/api/projects", {
        ...data,
        technologies:
          data.technologies.length > 0 ? data.technologies.join(",") : "",
        metadata: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project added!",
        description: "Your project has been successfully added.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Project & { technologies: string[] }) => {
      return apiPut(`/api/projects/${data.id}`, {
        ...data,
        technologies:
          data.technologies.length > 0 ? data.technologies.join(",") : "",
        metadata: data.metadata || {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Project updated",
        description: "The project has been successfully updated.",
      });
      setEditingProject(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Sync all GitHub repos mutation
  const syncAllGithubMutation = useMutation({
    mutationFn: async () => {
      return apiPost<{ summary: { created: number; updated: number } }>("/api/projects/sync-github-all", {});
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "GitHub Sync Complete!",
        description: `Created ${data.summary.created} new projects, updated ${data.summary.updated} existing.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to sync GitHub repos. Make sure your GitHub token is configured.",
        variant: "destructive",
      });
    },
  });

  // Regenerate single project image mutation
  const regenerateImageMutation = useMutation({
    mutationFn: async (projectId: number) => {
      setRegeneratingId(projectId);
      return apiPost<{ imageSource: string; project: { title: string } }>(`/api/projects/${projectId}/regenerate-image`, {});
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      const sourceLabel = data.imageSource === "gemini" ? "AI-generated" :
                         data.imageSource === "github" ? "GitHub" : "placeholder";
      toast({
        title: "Image Regenerated!",
        description: `New ${sourceLabel} image created for "${data.project.title}".`,
      });
      setRegeneratingId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to regenerate image. Please try again.",
        variant: "destructive",
      });
      setRegeneratingId(null);
    },
  });

  // Batch regenerate all project images mutation
  const regenerateAllImagesMutation = useMutation({
    mutationFn: async () => {
      return apiPost<{ summary: { geminiGenerated: number; fallback: number } }>("/api/projects/regenerate-images-batch", {});
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Batch Image Generation Complete!",
        description: `${data.summary.geminiGenerated} AI-generated, ${data.summary.fallback} fallback images.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to regenerate images. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Inline title update mutation
  const inlineTitleMutation = useMutation({
    mutationFn: async ({ id, title }: { id: number; title: string }) => {
      return apiPut(`/api/projects/${id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Title updated",
        description: "Project title has been updated successfully.",
      });
      setInlineEditId(null);
      setInlineEditTitle("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update title. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInlineEditStart = (project: Project) => {
    setInlineEditId(project.id);
    setInlineEditTitle(project.title);
  };

  const handleInlineEditSave = () => {
    if (inlineEditId && inlineEditTitle.trim()) {
      inlineTitleMutation.mutate({ id: inlineEditId, title: inlineEditTitle.trim() });
    }
  };

  const handleInlineEditCancel = () => {
    setInlineEditId(null);
    setInlineEditTitle("");
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies || [],
      link: project.link ?? null,
      githubLink: project.githubLink ?? null,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Manage Projects</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => regenerateAllImagesMutation.mutate()}
            disabled={regenerateAllImagesMutation.isPending}
            variant="outline"
            className="gap-2"
            title={imageGenStatus?.available ? "Generate AI thumbnails for all projects" : "AI image generation not configured"}
          >
            {regenerateAllImagesMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            {regenerateAllImagesMutation.isPending ? "Generating..." : "Regenerate All Images"}
          </Button>
          <Button
            onClick={() => syncAllGithubMutation.mutate()}
            disabled={syncAllGithubMutation.isPending}
            className="gap-2"
          >
            {syncAllGithubMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Github className="h-4 w-4" />
            )}
            {syncAllGithubMutation.isPending ? "Syncing..." : "Sync All GitHub Repos"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                if (editingProject) {
                  const updateData = {
                    ...editingProject,
                    ...data,
                    technologies: data.technologies || [],
                    link: data.link || null,
                    githubLink: data.githubLink || null,
                  } as Project & { technologies: string[] };
                  updateMutation.mutate(updateData);
                } else {
                  mutation.mutate(data);
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Project description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="React, TypeScript, Node.js"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const technologies = value
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t);
                          field.onChange(technologies);
                        }}
                        value={
                          Array.isArray(field.value)
                            ? field.value.join(", ")
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field: { value, onChange, onBlur, ref, name } }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value || null)}
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="githubLink"
                render={({ field: { value, onChange, onBlur, ref, name } }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username/repo"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value || null)}
                        onBlur={onBlur}
                        name={name}
                        ref={ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                {editingProject && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingProject(null);
                      form.reset({
                        title: "",
                        description: "",
                        image: "",
                        technologies: [],
                        link: null,
                        githubLink: null,
                      });
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={mutation.isPending || updateMutation.isPending}
                >
                  {editingProject
                    ? updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"
                    : mutation.isPending
                      ? "Adding..."
                      : "Add Project"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Existing Projects</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading projects...
            </div>
          ) : (
            <div className="space-y-4">
              {projects?.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Inline Title Editing */}
                    {inlineEditId === project.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          ref={inlineInputRef}
                          type="text"
                          value={inlineEditTitle}
                          onChange={(e) => setInlineEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleInlineEditSave();
                            if (e.key === "Escape") handleInlineEditCancel();
                          }}
                          className="flex-1 px-3 py-1.5 text-sm font-medium border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter title with Polish characters (ą, ę, ć, ł...)"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleInlineEditSave}
                          disabled={inlineTitleMutation.isPending}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleInlineEditCancel}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h4 className="font-medium truncate">{project.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleInlineEditStart(project)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary shrink-0"
                          title="Quick edit title (for Polish characters)"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        Edit All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => regenerateImageMutation.mutate(project.id)}
                        disabled={regeneratingId === project.id || regenerateAllImagesMutation.isPending}
                        title={imageGenStatus?.available ? "Regenerate project thumbnail with AI" : "Uses GitHub/placeholder fallback"}
                      >
                        {regeneratingId === project.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                      </Button>
                      {project.githubLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              await apiPost(`/api/projects/${project.id}/sync-github`, {});
                              await queryClient.invalidateQueries({
                                queryKey: ["projects"],
                              });
                              toast({
                                title: "Success",
                                description:
                                  "Project synchronized with GitHub successfully",
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description:
                                  "Failed to sync with GitHub. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Sync GitHub
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this project? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(project.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {project.technologies?.map((tech: string) => (
                      <span
                        key={tech}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
