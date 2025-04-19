import { activities, symptoms, users, type User, type InsertUser, type Activity, type Symptom, type HealthProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateHealthProfile(userId: number, profile: HealthProfile): Promise<User>;
  addActivity(userId: number, activity: Omit<Activity, "id" | "userId">): Promise<Activity>;
  getActivities(userId: number): Promise<Activity[]>;
  addSymptom(userId: number, symptom: Omit<Symptom, "id" | "userId">): Promise<Symptom>;
  getSymptoms(userId: number): Promise<Symptom[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateHealthProfile(userId: number, profile: HealthProfile): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ healthProfile: profile })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async addActivity(userId: number, activity: Omit<Activity, "id" | "userId">): Promise<Activity> {
    const date = new Date();
    const [newActivity] = await db
      .insert(activities)
      .values({ ...activity, userId, date })
      .returning();
    return newActivity;
  }

  async getActivities(userId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  async addSymptom(userId: number, symptom: Omit<Symptom, "id" | "userId">): Promise<Symptom> {
    const date = new Date();
    const [newSymptom] = await db
      .insert(symptoms)
      .values({ ...symptom, userId, date })
      .returning();
    return newSymptom;
  }

  async getSymptoms(userId: number): Promise<Symptom[]> {
    return await db.select().from(symptoms).where(eq(symptoms.userId, userId));
  }
}

export const storage = new DatabaseStorage();