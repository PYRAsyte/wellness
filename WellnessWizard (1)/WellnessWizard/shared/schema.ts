import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database Tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  healthProfile: json("health_profile").$type<HealthProfile>(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  duration: integer("duration").notNull(),
  calories: integer("calories"),
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes"),
});

export const symptoms = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  severity: integer("severity").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  notes: text("notes"),
});

// Types and Schemas
export type HealthProfile = {
  age: number;
  height: number;
  weight: number;
  goals: string[];
  medicalConditions: string[];
};

export const healthProfileSchema = z.object({
  age: z.number().min(13).max(120),
  height: z.number().positive(),
  weight: z.number().positive(),
  goals: z.array(z.string()),
  medicalConditions: z.array(z.string()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const activitySchema = createInsertSchema(activities).omit({
  id: true,
  userId: true,
  date: true,
});

export const symptomSchema = createInsertSchema(symptoms).omit({
  id: true,
  userId: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Symptom = typeof symptoms.$inferSelect;