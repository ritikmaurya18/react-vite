export type TodoStatus = "pending" | "in-progress" | "completed";
export type TodoPriority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate: string;
  category: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  editHistory: EditHistoryEntry[];
}

export interface EditHistoryEntry {
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface TodoFilter {
  status: TodoStatus | "all";
  priority: TodoPriority | "all";
  category: string | "all";
  search: string;
}

export type TodoSortField = "dueDate" | "priority" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface TodoSort {
  field: TodoSortField;
  direction: SortDirection;
}
