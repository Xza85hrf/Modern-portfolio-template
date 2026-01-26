import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCommentSchema, type Comment } from "@db/schema";
import { Button } from "@/components/ui/button";
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
import { format, formatDistanceToNow } from "date-fns";

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      return Array.isArray(data) ? data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) : [];
    },
  });

  const form = useForm({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
      postId: postId,
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: { name: string; email: string; content: string }) => {
      console.log("Submitting comment with postId:", postId);
      const payload = {
        postId,
        ...formData
      };
      console.log("Comment payload:", payload);
      
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const responseData = await response.json();
      console.log("Server response:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to post comment');
      }
      
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast({
        title: "Comment posted!",
        description: "Your comment has been successfully added to the discussion.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Comment submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Comments</h3>
        <span className="text-sm text-muted-foreground">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="space-y-2 p-4 border rounded-lg bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{comment.name}</div>
                <div 
                  className="text-sm text-muted-foreground"
                  title={format(new Date(comment.createdAt), "PPpp")}
                >
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
              <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="border rounded-lg p-6 bg-card/50 backdrop-blur-sm">
        <h4 className="text-xl font-semibold mb-4">Add a Comment</h4>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit((data) => {
              console.log("Form submitted with data:", data);
              return mutation.mutate(data);
            })} 
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts..." 
                      className="min-h-[100px]"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
              onClick={(e) => {
                e.preventDefault();
                const data = form.getValues();
                console.log("Submit button clicked, form data:", data);
                mutation.mutate(data);
              }}
            >
              {mutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
