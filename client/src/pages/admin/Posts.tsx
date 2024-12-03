import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Post, insertPostSchema } from "@db/schema";
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
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
import BlogEditor from "../../components/BlogEditor";
import { useToast } from "@/hooks/use-toast";

type PostFormData = {
  title: string;
  content: JSONContent;
  slug: string;
  tags: string[];
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function Posts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => fetch("/api/posts").then((res) => res.json()),
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      slug: "",
      tags: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PostFormData) =>
      fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: data.tags?.join(',') || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post added!",
        description: "Your blog post has been successfully added.",
      });
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch(`/api/posts/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: data.tags?.join(',') || null,
          updatedAt: new Date(),
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update post');
        } else {
          throw new Error('Server error: Failed to update post');
        }
      }

      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post updated",
        description: "The blog post has been successfully updated.",
      });
      setEditingPost(null);
      form.reset({
        title: "",
        content: { type: "doc", content: [{ type: "paragraph" }] },
        slug: "",
        tags: [],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update the post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post deleted",
        description: "The blog post has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      content: post.content as JSONContent,
      slug: post.slug,
      tags: post.tags ? post.tags.split(',') : [],
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Manage Blog Posts</h2>
      
      <div className="space-y-8">
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">
            {editingPost ? "Edit Post" : "Add New Post"}
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
              if (editingPost) {
                const updateData = {
                  ...data,
                  id: editingPost.id,
                  createdAt: editingPost.createdAt
                };
                updateMutation.mutate(updateData);
              } else {
                mutation.mutate(data);
              }
            })} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="post-title"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <BlogEditor
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="react, typescript, web development"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()))}
                        value={field.value?.join(", ") || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                {editingPost && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingPost(null);
                      form.reset({
                        title: "",
                        content: { type: "doc", content: [{ type: "paragraph" }] },
                        slug: "",
                        tags: [],
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
                  {editingPost
                    ? updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"
                    : mutation.isPending
                    ? "Adding..."
                    : "Add Post"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Existing Posts</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading posts...
            </div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{post.title}</h4>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(post)}
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
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this blog post? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Slug: {post.slug}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags && post.tags.split(',').map((tag: string, index: number) => (
                      <span key={`${post.id}-${tag}-${index}`} className="text-xs bg-muted px-2 py-1 rounded">
                        {tag}
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
