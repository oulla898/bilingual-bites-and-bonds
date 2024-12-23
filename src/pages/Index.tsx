import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Utensils, Users } from "lucide-react";

const Index = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const options = [
    {
      id: "food",
      title: t("food"),
      icon: Utensils,
      path: "/food",
    },
    {
      id: "activities",
      title: t("activities"),
      icon: Users,
      path: "/activities",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <LanguageSwitch />
      <div className="container mx-auto max-w-4xl pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => (
            <Card
              key={option.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer animate-fade-in"
              onClick={() => navigate(option.path)}
            >
              <div className="flex flex-col items-center space-y-4">
                <option.icon className="w-12 h-12 text-teal" />
                <h2 className="text-xl font-semibold">{option.title}</h2>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;