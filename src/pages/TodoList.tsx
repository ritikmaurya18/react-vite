import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTodos } from "@/context/TodoContext";
import { TodoFilter } from "@/components/TodoFilter";
import { TodoForm } from "@/components/TodoForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { TodoFilter as TodoFilterType, TodoSort, TodoPriority } from "@/types/todo";

const ITEMS_PER_PAGE = 10;

const priorityOrder: Record<TodoPriority, number> = { high: 0, medium: 1, low: 2 };

export function TodoList() {
  const { todos, deleteTodo, deleteCompleted, canAddTodo } = useTodos();
  const [filter, setFilter] = useState<TodoFilterType>({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
  });
  const [sort, setSort] = useState<TodoSort>({ field: "dueDate", direction: "asc" });
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(todos.map((t) => t.category).filter(Boolean))],
    [todos]
  );

  const filtered = useMemo(() => {
    let result = [...todos];

    if (filter.status !== "all") {
      result = result.filter((t) => t.status === filter.status);
    }
    if (filter.priority !== "all") {
      result = result.filter((t) => t.priority === filter.priority);
    }
    if (filter.category !== "all") {
      result = result.filter((t) => t.category === filter.category);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sort.field === "priority") {
        cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sort.field === "dueDate") {
        cmp = (a.dueDate || "z").localeCompare(b.dueDate || "z");
      } else {
        cmp = a.createdAt.localeCompare(b.createdAt);
      }
      return sort.direction === "asc" ? cmp : -cmp;
    });

    return result;
  }, [todos, filter, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const completedCount = todos.filter((t) => t.status === "completed").length;

  const handleFilterChange = (partial: Partial<TodoFilterType>) => {
    setFilter((prev) => ({ ...prev, ...partial }));
    setPage(1);
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Todos</h2>
          <p className="text-muted-foreground">{filtered.length} todos found</p>
        </div>
        <div className="flex gap-2">
          {completedCount > 0 && (
            <Button variant="destructive" size="sm" onClick={deleteCompleted}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Completed
            </Button>
          )}
          <Button size="sm" onClick={() => setCreateOpen(true)} disabled={!canAddTodo}>
            <Plus className="mr-2 h-4 w-4" /> New Todo
          </Button>
        </div>
      </div>

      <TodoFilter
        filter={filter}
        sort={sort}
        categories={categories}
        onFilterChange={handleFilterChange}
        onSortChange={setSort}
      />

      <div className="space-y-2">
        {paginated.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No todos match your filters.
            </CardContent>
          </Card>
        ) : (
          paginated.map((todo) => (
            <Card key={todo.id} className="transition-colors hover:bg-accent/50">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/todos/${todo.id}`}
                      className={cn(
                        "font-medium hover:underline",
                        todo.status === "completed" && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.title}
                    </Link>
                    {todo.dueDate && (
                      <p className="text-xs text-muted-foreground">
                        Due: {format(parseISO(todo.dueDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={priorityColors[todo.priority]}>{todo.priority}</Badge>
                  <Badge className={statusColors[todo.status]}>{todo.status}</Badge>
                  {todo.category && (
                    <Badge variant="outline">{todo.category}</Badge>
                  )}
                  <Link to={`/todos/${todo.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirmId(todo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Todo</DialogTitle>
          </DialogHeader>
          <TodoForm onSubmit={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this todo? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) deleteTodo(deleteConfirmId);
                setDeleteConfirmId(null);
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
