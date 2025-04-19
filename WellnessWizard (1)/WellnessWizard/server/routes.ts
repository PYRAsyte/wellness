import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { activitySchema, symptomSchema, healthProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/health-profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const profile = healthProfileSchema.parse(req.body);
      const user = await storage.updateHealthProfile(req.user.id, profile);
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  });

  app.post("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const activity = activitySchema.parse(req.body);
      const result = await storage.addActivity(req.user.id, activity);
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  });

  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const activities = await storage.getActivities(req.user.id);
    res.json(activities);
  });

  app.post("/api/symptoms", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const symptom = symptomSchema.parse(req.body);
      const result = await storage.addSymptom(req.user.id, symptom);
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  });

  app.get("/api/symptoms", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const symptoms = await storage.getSymptoms(req.user.id);
    res.json(symptoms);
  });

  const httpServer = createServer(app);
  return httpServer;
}
