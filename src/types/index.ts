export type Language = "en" | "ar";

export interface User {
  name: string;
  gender: "male" | "female";
  age: number;
}

export interface Post {
  id: string;
  authorId: string;
  type: "food" | "activity";
  title: string;
  description: string;
  imageUrl?: string;
  participants?: string[];
  comments?: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}