import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useTodos } from "@/context/TodoContext";
import type { Todo, TodoPriority, TodoStatus } from "@/types/todo";

interface TodoFormProps {
  todo?: Todo;
  onSubmit?: () => void;
  compact?: boolean;
}

export function TodoForm({ todo, onSubmit, compact }: TodoFormProps) {
  const { addTodo, updateTodo, categories, canAddTodo } = useTodos();
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [priority, setPriority] = useState<TodoPriority>(todo?.priority || "medium");
  const [dueDate, setDueDate] = useState(todo?.dueDate || "");
  const [category, setCategory] = useState(todo?.category || "");
  const [status, setStatus] = useState<TodoStatus>(todo?.status || "pending");

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const categoryOptions = [
    { value: "", label: "No Category" },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (todo) {
      await updateTodo(todo.id, { title, description, priority, dueDate, category, status });
    } else {
      await addTodo({ title, description, priority, dueDate, category, status });
    }

    if (!todo) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCategory("");
      setStatus("pending");
    }
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!compact && (
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
        </div>
      )}
      {compact && (
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quick add a todo..."
            required
            className="flex-1"
          />
          <Button type="submit" disabled={!canAddTodo && !todo}>
            Add
          </Button>
        </div>
      )}
      {!compact && (
        <>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)}
                options={priorityOptions}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TodoStatus)}
                options={statusOptions}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={!canAddTodo && !todo}>
            {todo ? "Update Todo" : "Create Todo"}
          </Button>
        </>
      )}
    </form>
  );
}
