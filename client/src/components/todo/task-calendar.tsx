import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Task } from "@shared/schema";

interface TaskCalendarProps {
  tasks: Task[];
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group tasks by due date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      const date = format(new Date(task.dueDate), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  // Get tasks for the selected date
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const selectedTasks = tasksByDate[selectedDateStr] || [];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            hasTasks: (date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              return !!tasksByDate[dateStr];
            },
          }}
          modifiersStyles={{
            hasTasks: {
              backgroundColor: "hsl(var(--primary) / 0.1)",
              color: "hsl(var(--primary))",
            },
          }}
        />

        <div>
          <h4 className="font-medium mb-2">
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </h4>
          <div className="space-y-2">
            {selectedTasks.map((task) => (
              <div
                key={task.id}
                className="p-2 rounded-md border bg-background/50"
              >
                <p className="font-medium">{task.title}</p>
                <Badge variant="outline" className="mt-1">
                  {task.priority}
                </Badge>
              </div>
            ))}
            {selectedTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No tasks scheduled for this date
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
