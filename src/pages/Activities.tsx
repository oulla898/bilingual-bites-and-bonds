import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Plus, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Activities = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get the current user's ID from localStorage
  const userData = localStorage.getItem("userData");
  const userId = userData ? JSON.parse(userData).id : null;

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id(name),
          participants(user_id)
        `)
        .eq("type", "activity")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleJoinActivity = async (activityId: string) => {
    if (!userId) {
      toast({
        title: t("Error"),
        description: t("You must be logged in to join activities"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("participants")
        .insert({ 
          post_id: activityId,
          user_id: userId
        });

      if (error) throw error;

      toast({
        title: t("Success"),
        description: t("You have joined the activity"),
      });
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
        <Button onClick={() => navigate("/activities/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t("Create Activity")}
        </Button>
      </div>

      {isLoadingActivities ? (
        <div className="flex justify-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities?.map((activity) => (
            <Card key={activity.id} className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">{activity.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("Posted by")}: {activity.profiles?.name}
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{activity.participants?.length || 0} {t("participants")}</span>
                  </div>
                  <Button
                    onClick={() => handleJoinActivity(activity.id)}
                    disabled={isLoading}
                  >
                    {t("Join")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;