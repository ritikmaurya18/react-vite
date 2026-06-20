import { useTodos } from "@/context/TodoContext";
import { StatsCard } from "@/components/StatsCard";
import { TodoForm } from "@/components/TodoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const MAX_TODO_ITEMS = Number(import.meta.env.VITE_MAX_TODO_ITEMS) || 50;

export function Dashboard() {
  const { todos, canAddTodo } = useTodos();

  const total = todos.length;
  const pending = todos.filter((t) => t.status === "pending").length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const overdue = todos.filter(
    (t) => t.status !== "completed" && t.dueDate && isPast(parseISO(t.dueDate))
  ).length;

  const recentTodos = [...todos]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your tasks</p>
      </div>

      {!canAddTodo && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">
              Maximum todo limit reached ({MAX_TODO_ITEMS}). Delete some todos to create new ones.
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total"
          value={total}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
          description="All todos"
        />
        <StatsCard
          title="Pending"
          value={pending}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="Awaiting action"
        />
        <StatsCard
          title="Completed"
          value={completed}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
          description="Done"
        />
        <StatsCard
          title="Overdue"
          value={overdue}
          icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
          description="Past due date"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Add</CardTitle>
          </CardHeader>
          <CardContent>
            <TodoForm compact />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Todos</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTodos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No todos yet. Create one!</p>
            ) : (
              <div className="space-y-3">
                {recentTodos.map((todo) => (
                  <Link
                    key={todo.id}
                    to={`/todos/${todo.id}`}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-medium",
                          todo.status === "completed" && "line-through text-muted-foreground"
                        )}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityColors[todo.priority]}>{todo.priority}</Badge>
                      <Badge className={statusColors[todo.status]}>
                        {todo.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
