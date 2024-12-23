import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LanguageSwitch } from "@/components/LanguageSwitch";

const UserInfo = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name) {
      // Here we would normally call the gender API
      // For now, we'll just move to the next step
      setStep(2);
    } else if (step === 2 && age) {
      const userData = {
        name,
        age: parseInt(age),
        gender: "male", // This would come from the API
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/main");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <LanguageSwitch />
      <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-center">
          {t("welcome")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                {t("enter.name")}
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={language === "ar" ? "text-right" : "text-left"}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                {t("enter.age")}
              </label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {step === 1 ? t("next") : t("finish")}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserInfo;