import React, { createContext, useContext, useState } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "welcome": "Welcome",
    "enter.name": "Please enter your name",
    "enter.age": "Please enter your age",
    "food": "Food",
    "activities": "Activities",
    "join": "Join",
    "post": "Post",
    "comment": "Comment",
    "cancel": "Cancel",
  },
  ar: {
    "welcome": "مرحباً",
    "enter.name": "الرجاء إدخال اسمك",
    "enter.age": "الرجاء إدخال عمرك",
    "food": "الطعام",
    "activities": "النشاطات",
    "join": "انضم",
    "post": "نشر",
    "comment": "تعليق",
    "cancel": "إلغاء",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};