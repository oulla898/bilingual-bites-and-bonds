import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const UserInfo = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create an anonymous session
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: `${Date.now()}@anonymous.com`,
        password: `${Date.now()}${Math.random()}`,
      });

      if (authError) throw authError;
      if (!user) throw new Error("No user returned from signup");

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          name,
          age: parseInt(age),
        });

      if (profileError) throw profileError;

      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify({
        id: user.id,
        name,
        age: parseInt(age),
      }));

      toast({
        title: "Success",
        description: "Profile created successfully!",
      });

      navigate("/main");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("welcome")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder={t("enter.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder={t("enter.age")}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="1"
                max="120"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : t("join")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInfo;