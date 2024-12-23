import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Activities = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Get current user data
  const userData = localStorage.getItem("userData");
  const currentUser = userData ? JSON.parse(userData) : null;

  const { data: activities, refetch: refetchActivities } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles(name, age),
          participants:participants(
            profiles:profiles(name, age)
          )
        `)
        .eq("type", "activity")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/user-info");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: currentUser.id,
          type: "activity",
          title,
          description,
        });

      if (error) throw error;

      toast({
        title: t("Success"),
        description: "Activity created successfully!",
      });

      setTitle("");
      setDescription("");
      setShowCreateForm(false);
      refetchActivities();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: t("Error"),
        description: "Failed to create activity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinActivity = async (activityId: string) => {
    if (!currentUser) {
      navigate("/user-info");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("participants")
        .insert({ 
          post_id: activityId,
          user_id: currentUser.id
        });

      if (error) throw error;

      toast({
        title: t("Success"),
        description: t("You have joined the activity"),
      });
      refetchActivities();
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to join activity"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/main")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Back")}
        </Button>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showCreateForm ? "Cancel" : t("Create Activity")}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t("Create Activity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <Input
                placeholder="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Activity Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities?.map((activity: any) => (
          <Card key={activity.id} className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl">{activity.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("Posted by")}: {activity.profiles?.name} (Age: {activity.profiles?.age})
              </p>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{activity.description}</p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{activity.participants?.length || 0} {t("participants")}</span>
                </div>
                {activity.participants?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Participants:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.participants.map((participant: any, index: number) => (
                        <span key={index} className="bg-muted px-2 py-1 rounded-md text-sm">
                          {participant.profiles.name} (Age: {participant.profiles.age})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => handleJoinActivity(activity.id)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {t("Join")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Activities;