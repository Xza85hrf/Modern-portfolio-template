import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Project, insertProjectSchema } from "@db/schema";
import { Button } from "@/components/ui/button";
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

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/projects").then((res) => res.json()),
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
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          technologies:
            data.technologies.length > 0 ? data.technologies.join(",") : "",
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.json();
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
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return response.json();
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
      const response = await fetch(`/api/projects/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          technologies:
            data.technologies.length > 0 ? data.technologies.join(",") : "",
          metadata: data.metadata || {},
          updatedAt: new Date(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return response.json();
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

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      description: project.description,
      image: project.image,
      technologies: project.technologies ? project.technologies.split(",") : [],
      link: project.link ?? null,
      githubLink: project.githubLink ?? null,
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Manage Projects</h2>

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
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.title}</h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </Button>
                      {project.githubLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                `/api/projects/${project.id}/sync-github`,
                                {
                                  method: "POST",
                                }
                              );
                              if (!response.ok) {
                                throw new Error("Failed to sync with GitHub");
                              }
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
                    {(Array.isArray(project.technologies)
                      ? project.technologies
                      : project.technologies
                        ? project.technologies.split(",")
                        : []
                    ).map((tech: string) => (
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
