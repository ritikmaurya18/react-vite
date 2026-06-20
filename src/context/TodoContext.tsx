import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Todo, TodoStatus, TodoPriority } from "@/types/todo";
import type { Category } from "@/types/category";
import { todoService } from "@/api/todoService";
import { categoryService } from "@/api/categoryService";
import { getFromStorage, setToStorage } from "@/lib/localStorage";
import { generateId } from "@/lib/utils";

const MAX_TODO_ITEMS = Number(import.meta.env.VITE_MAX_TODO_ITEMS) || 50;
const ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === "true";

function logAnalytics(event: string, data?: Record<string, unknown>) {
  if (ANALYTICS_ENABLED) {
    console.log(`[Analytics] ${event}`, data ?? "");
  }
}

interface TodoState {
  todos: Todo[];
  categories: Category[];
  loading: boolean;
}

type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "DELETE_COMPLETED" }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.payload };
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case "DELETE_TODO":
      return { ...state, todos: state.todos.filter((t) => t.id !== action.payload) };
    case "DELETE_COMPLETED":
      return { ...state, todos: state.todos.filter((t) => t.status !== "completed") };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface TodoContextType extends TodoState {
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "editHistory">) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  deleteCompleted: () => Promise<void>;
  toggleTodoStatus: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
  canAddTodo: boolean;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const SAMPLE_TODOS: Todo[] = [
  {
    id: "sample-1",
    title: "Complete project proposal",
    description: "Draft and submit the Q3 project proposal for the new feature development.",
    priority: "high",
    dueDate: "2026-06-25",
    category: "Work",
    status: "in-progress",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-15T10:00:00Z",
    editHistory: [],
  },
  {
    id: "sample-2",
    title: "Buy groceries",
    description: "Milk, eggs, bread, vegetables, and fruits for the week.",
    priority: "medium",
    dueDate: "2026-06-21",
    category: "Personal",
    status: "pending",
    createdAt: "2026-06-16T08:00:00Z",
    updatedAt: "2026-06-16T08:00:00Z",
    editHistory: [],
  },
  {
    id: "sample-3",
    title: "Schedule dentist appointment",
    description: "Call Dr. Smith's office to schedule a routine checkup.",
    priority: "low",
    dueDate: "2026-06-30",
    category: "Health",
    status: "pending",
    createdAt: "2026-06-17T09:00:00Z",
    updatedAt: "2026-06-17T09:00:00Z",
    editHistory: [],
  },
  {
    id: "sample-4",
    title: "Review pull requests",
    description: "Review and approve pending pull requests from the team.",
    priority: "high",
    dueDate: "2026-06-20",
    category: "Work",
    status: "completed",
    createdAt: "2026-06-14T11:00:00Z",
    updatedAt: "2026-06-18T14:00:00Z",
    editHistory: [
      {
        timestamp: "2026-06-18T14:00:00Z",
        field: "status",
        oldValue: "in-progress",
        newValue: "completed",
      },
    ],
  },
  {
    id: "sample-5",
    title: "Read 'Clean Code' chapter 5",
    description: "Continue reading the Clean Code book, focusing on error handling.",
    priority: "low",
    dueDate: "2026-07-01",
    category: "Learning",
    status: "pending",
    createdAt: "2026-06-18T16:00:00Z",
    updatedAt: "2026-06-18T16:00:00Z",
    editHistory: [],
  },
];

const SAMPLE_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Work", color: "#3b82f6", createdAt: "2026-06-15T00:00:00Z" },
  { id: "cat-2", name: "Personal", color: "#10b981", createdAt: "2026-06-15T00:00:00Z" },
  { id: "cat-3", name: "Health", color: "#f59e0b", createdAt: "2026-06-15T00:00:00Z" },
  { id: "cat-4", name: "Learning", color: "#8b5cf6", createdAt: "2026-06-15T00:00:00Z" },
];

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    categories: [],
    loading: true,
  });

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const todos = await todoService.getAll();
      const categories = await categoryService.getAll();

      if (todos.length === 0 && categories.length === 0) {
        setToStorage("todo_app_data", SAMPLE_TODOS);
        setToStorage("todo_categories", SAMPLE_CATEGORIES);
        dispatch({ type: "SET_TODOS", payload: SAMPLE_TODOS });
        dispatch({ type: "SET_CATEGORIES", payload: SAMPLE_CATEGORIES });
      } else {
        dispatch({ type: "SET_TODOS", payload: todos });
        dispatch({ type: "SET_CATEGORIES", payload: categories });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    };
    loadData();
  }, []);

  const canAddTodo = state.todos.length < MAX_TODO_ITEMS;

  const addTodo = async (todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "editHistory">) => {
    if (!canAddTodo) return;
    const newTodo = await todoService.create(todo);
    dispatch({ type: "ADD_TODO", payload: newTodo });
    logAnalytics("todo_created", { id: newTodo.id, priority: newTodo.priority });
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const updated = await todoService.update(id, updates);
    if (updated) {
      dispatch({ type: "UPDATE_TODO", payload: updated });
      logAnalytics("todo_updated", { id, fields: Object.keys(updates) });
    }
  };

  const deleteTodo = async (id: string) => {
    await todoService.delete(id);
    dispatch({ type: "DELETE_TODO", payload: id });
    logAnalytics("todo_deleted", { id });
  };

  const deleteCompleted = async () => {
    await todoService.deleteCompleted();
    dispatch({ type: "DELETE_COMPLETED" });
    logAnalytics("todos_bulk_delete_completed");
  };

  const toggleTodoStatus = async (id: string) => {
    const todo = state.todos.find((t) => t.id === id);
    if (!todo) return;
    const nextStatus: TodoStatus =
      todo.status === "completed" ? "pending" : "completed";
    await updateTodo(id, { status: nextStatus });
  };

  const addCategory = async (category: Omit<Category, "id" | "createdAt">) => {
    const newCategory = await categoryService.create(category);
    dispatch({ type: "ADD_CATEGORY", payload: newCategory });
    logAnalytics("category_created", { id: newCategory.id, name: newCategory.name });
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const updated = await categoryService.update(id, updates);
    if (updated) {
      dispatch({ type: "UPDATE_CATEGORY", payload: updated });
      logAnalytics("category_updated", { id });
    }
  };

  const deleteCategory = async (id: string) => {
    await categoryService.delete(id);
    dispatch({ type: "DELETE_CATEGORY", payload: id });
    logAnalytics("category_deleted", { id });
  };

  const resetData = async () => {
    setToStorage("todo_app_data", SAMPLE_TODOS);
    setToStorage("todo_categories", SAMPLE_CATEGORIES);
    dispatch({ type: "SET_TODOS", payload: SAMPLE_TODOS });
    dispatch({ type: "SET_CATEGORIES", payload: SAMPLE_CATEGORIES });
    logAnalytics("data_reset");
  };

  return (
    <TodoContext.Provider
      value={{
        ...state,
        addTodo,
        updateTodo,
        deleteTodo,
        deleteCompleted,
        toggleTodoStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        resetData,
        canAddTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
}
