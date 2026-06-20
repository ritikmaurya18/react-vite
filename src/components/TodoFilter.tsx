import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { TodoFilter as TodoFilterType, TodoSort, TodoSortField, SortDirection } from "@/types/todo";

interface TodoFilterProps {
  filter: TodoFilterType;
  sort: TodoSort;
  categories: string[];
  onFilterChange: (filter: Partial<TodoFilterType>) => void;
  onSortChange: (sort: TodoSort) => void;
}

export function TodoFilter({ filter, sort, categories, onFilterChange, onSortChange }: TodoFilterProps) {
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const sortFieldOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "createdAt", label: "Created" },
  ];

  const sortDirOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search todos..."
          value={filter.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Select
          value={filter.status}
          onChange={(e) => onFilterChange({ status: e.target.value as TodoFilterType["status"] })}
          options={statusOptions}
        />
        <Select
          value={filter.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value as TodoFilterType["priority"] })}
          options={priorityOptions}
        />
        <Select
          value={filter.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          options={categoryOptions}
        />
        <div className="flex gap-1">
          <Select
            value={sort.field}
            onChange={(e) => onSortChange({ ...sort, field: e.target.value as TodoSortField })}
            options={sortFieldOptions}
            className="flex-1"
          />
          <Select
            value={sort.direction}
            onChange={(e) => onSortChange({ ...sort, direction: e.target.value as SortDirection })}
            options={sortDirOptions}
            className="w-28"
          />
        </div>
      </div>
    </div>
  );
}
