import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  tags: text("tags").array().notNull().default([]),
  order: integer("order").notNull(),
  dueDate: timestamp("due_date", { mode: 'string' }),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, completed: true })
  .extend({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    priority: z.enum(["low", "medium", "high"]),
    tags: z.array(z.string()),
    dueDate: z.string().datetime().optional(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;