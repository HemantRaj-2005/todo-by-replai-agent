import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@shared/schema";

interface TaskProgressProps {
  tasks: Task[];
}

export function TaskProgress({ tasks }: TaskProgressProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Progress</h3>
        <Progress value={percentage} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {completed} of {total} tasks completed ({percentage}%)
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Priority Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">High</span>
            <span className="text-sm text-red-500">{priorityCounts.high || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Medium</span>
            <span className="text-sm text-yellow-500">{priorityCounts.medium || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Low</span>
            <span className="text-sm text-green-500">{priorityCounts.low || 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
