import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Food = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Fetch food posts
  const { data: posts, refetch: refetchPosts } = useQuery({
    queryKey: ["food-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles(name),
          comments:comments(
            id,
            content,
            created_at,
            profiles:profiles(name)
          )
        `)
        .eq("type", "food")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create a new food post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a post",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        type: "food",
        title,
        description,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe posted successfully!",
      });

      setTitle("");
      setDescription("");
      refetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  // Add a comment to a post
  const handleAddComment = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to comment",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: comment,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully!",
      });

      setComment("");
      setSelectedPostId(null);
      refetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Create Post Form */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("post")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              placeholder="Recipe Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Recipe Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Button type="submit">{t("post")}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="grid gap-6">
        {posts?.map((post: any) => (
          <Card key={post.id} className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted by {post.profiles?.name}
              </p>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{post.description}</p>
              
              {/* Comments Section */}
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Comments</h4>
                {post.comments?.map((comment: any) => (
                  <div key={comment.id} className="bg-muted p-2 rounded-md">
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      - {comment.profiles?.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2">
              {selectedPostId === post.id ? (
                <>
                  <Textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleAddComment(post.id)}>
                      {t("comment")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPostId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setSelectedPostId(post.id)}>
                  {t("comment")}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Food;