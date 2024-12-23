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
    "Back": "Back",
    "Create Activity": "Create Activity",
    "Posted by": "Posted by",
    "participants": "participants",
    "Success": "Success",
    "Error": "Error",
    "You have joined the activity": "You have joined the activity",
    "Failed to join activity": "Failed to join activity"
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
    "Back": "رجوع",
    "Create Activity": "إنشاء نشاط",
    "Posted by": "نشر بواسطة",
    "participants": "المشاركون",
    "Success": "نجاح",
    "Error": "خطأ",
    "You have joined the activity": "لقد انضممت إلى النشاط",
    "Failed to join activity": "فشل الانضمام إلى النشاط"
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