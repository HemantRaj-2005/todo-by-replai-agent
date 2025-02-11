import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { Task } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onComplete: (completed: boolean) => void;
  onDelete: () => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-red-500/10 text-red-500"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-4 flex items-center gap-4 group hover:shadow-lg transition-shadow">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onComplete}
          className="data-[state=checked]:bg-primary"
        />
        
        <div className="flex-1">
          <p className={cn(
            "font-medium transition-colors",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            {task.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80" />
        </button>
      </Card>
    </motion.div>
  );
}
