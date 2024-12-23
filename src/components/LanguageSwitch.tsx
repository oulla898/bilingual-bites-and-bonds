import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      variant="ghost"
      className="fixed top-4 right-4"
    >
      {language === "en" ? "العربية" : "English"}
    </Button>
  );
};