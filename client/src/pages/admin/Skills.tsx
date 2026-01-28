import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Skill, insertSkillSchema } from "@db/schema";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const skillCategories = ["Frontend", "Backend", "Database", "DevOps", "Other"];

export default function Skills() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: () => apiGet<Skill[]>("/api/skills"),
  });

  const form = useForm({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      name: "",
      category: "Frontend",
      proficiency: 50,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Omit<Skill, 'id'>) => apiPost("/api/skills", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill added!",
        description: "Your skill has been successfully added.",
      });
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Skill) => {
      return apiPut(`/api/skills/${data.id}`, {
        id: data.id,
        name: data.name,
        category: data.category,
        proficiency: data.proficiency
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill updated",
        description: "The skill has been successfully updated.",
      });
      setEditingSkill(null);
      form.reset({
        name: "",
        category: "Frontend",
        proficiency: 50,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiDelete(`/api/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({
        title: "Skill deleted",
        description: "The skill has been successfully deleted.",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Manage Skills</h2>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold mb-4">Add New Skill</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
              if (editingSkill) {
                const updateData = {
                  ...data,
                  id: editingSkill.id,
                };
                updateMutation.mutate(updateData);
              } else {
                mutation.mutate(data);
              }
            })} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Skill name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skillCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                        <div className="text-right text-sm text-muted-foreground">
                          {field.value}%
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                {editingSkill && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingSkill(null);
                      form.reset({
                        name: "",
                        category: "Frontend",
                        proficiency: 50,
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
                  {editingSkill
                    ? updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"
                    : mutation.isPending
                    ? "Adding..."
                    : "Add Skill"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Existing Skills</h3>
          {isLoading ? (
            <div>Loading skills...</div>
          ) : (
            <div className="space-y-4">
              {skills?.map((skill) => (
                <div key={skill.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{skill.name}</h4>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSkill(skill);
                          form.reset({
                            name: skill.name,
                            category: skill.category,
                            proficiency: skill.proficiency,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this skill? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(skill.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Category: {skill.category}</span>
                    <span>Proficiency: {skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
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
