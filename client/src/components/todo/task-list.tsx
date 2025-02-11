import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { TaskCard } from "./task-card";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Task } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function TaskList() {
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"]
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: Partial<Task> }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Task deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const reorderTasks = useMutation({
    mutationFn: async (tasks: Task[]) => {
      await apiRequest("POST", "/api/tasks/reorder", tasks.map(t => t.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg" />;
  }

  return (
    <Reorder.Group
      axis="y"
      values={tasks}
      onReorder={(newOrder) => reorderTasks.mutate(newOrder)}
      className="space-y-3 mt-6"
    >
      <AnimatePresence>
        {tasks.map((task) => (
          <Reorder.Item key={task.id} value={task}>
            <TaskCard
              task={task}
              onComplete={(completed) => 
                updateTask.mutate({ 
                  id: task.id, 
                  updates: { completed } 
                })
              }
              onDelete={() => deleteTask.mutate(task.id)}
            />
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}