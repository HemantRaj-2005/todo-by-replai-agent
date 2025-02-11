import { TaskList } from "@/components/todo/task-list";
import { AddTask } from "@/components/todo/add-task";
import { TaskProgress } from "@/components/todo/task-progress";
import { TaskCalendar } from "@/components/todo/task-calendar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";

export default function Home() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Task Master
          </h1>
          <ThemeToggle />
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <AddTask />
            <TaskList />
          </Card>

          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <TaskCalendar tasks={tasks} />
            <TaskProgress tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}