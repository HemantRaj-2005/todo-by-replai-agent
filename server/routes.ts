import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express) {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid task data" });
    }

    const task = await storage.createTask(result.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    const task = await storage.updateTask(id, req.body);
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteTask(id);
    res.status(204).end();
  });

  app.post("/api/tasks/reorder", async (req, res) => {
    const schema = z.array(z.number());
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    await storage.reorderTasks(result.data);
    res.status(204).end();
  });

  return createServer(app);
}
