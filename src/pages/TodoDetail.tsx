import { useParams, useNavigate, Link } from "react-router-dom";
import { useTodos } from "@/context/TodoContext";
import { TodoForm } from "@/components/TodoForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";

export function TodoDetail() {
  const { id } = useParams<{ id: string }>();
  const { todos, deleteTodo, toggleTodoStatus } = useTodos();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return (
      <div className="space-y-4">
        <Link to="/todos" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
        </Link>
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Todo not found.
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <Link
          to="/todos"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Todos
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className={todo.status === "completed" ? "line-through text-muted-foreground" : ""}>
              {todo.title}
            </CardTitle>
            <div className="flex gap-2 shrink-0">
              <Badge className={priorityColors[todo.priority]}>{todo.priority}</Badge>
              <Badge className={statusColors[todo.status]}>{todo.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {todo.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="mt-1">{todo.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Due Date</h4>
              <p className="mt-1">
                {todo.dueDate ? format(parseISO(todo.dueDate), "MMM d, yyyy") : "—"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
              <p className="mt-1">{todo.category || "—"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Created</h4>
              <p className="mt-1">{format(parseISO(todo.createdAt), "MMM d, yyyy HH:mm")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Updated</h4>
              <p className="mt-1">{format(parseISO(todo.updatedAt), "MMM d, yyyy HH:mm")}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => toggleTodoStatus(todo.id)}
          >
            Mark as {todo.status === "completed" ? "Pending" : "Completed"}
          </Button>
        </CardContent>
      </Card>

      {todo.editHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Edit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todo.editHistory.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md border p-3">
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{entry.field}</span>:{" "}
                      <span className="text-muted-foreground line-through">{entry.oldValue}</span>{" "}
                      → <span>{entry.newValue}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(entry.timestamp), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <TodoForm todo={todo} onSubmit={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{todo.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteTodo(todo.id);
                navigate("/todos");
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
