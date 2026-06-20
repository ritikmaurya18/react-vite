import apiClient from "./client";
import type { Todo } from "@/types/todo";
import { getFromStorage, setToStorage } from "@/lib/localStorage";

const STORAGE_KEY = "todo_app_data";

const useLocalStorage = true;

export const todoService = {
  async getAll(): Promise<Todo[]> {
    if (useLocalStorage) {
      return getFromStorage<Todo[]>(STORAGE_KEY, []);
    }
    const response = await apiClient.get<Todo[]>("/todos");
    return response.data;
  },

  async getById(id: string): Promise<Todo | undefined> {
    if (useLocalStorage) {
      const todos = getFromStorage<Todo[]>(STORAGE_KEY, []);
      return todos.find((t) => t.id === id);
    }
    const response = await apiClient.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  async create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "editHistory">): Promise<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      editHistory: [],
    };

    if (useLocalStorage) {
      const todos = getFromStorage<Todo[]>(STORAGE_KEY, []);
      todos.push(newTodo);
      setToStorage(STORAGE_KEY, todos);
      return newTodo;
    }
    const response = await apiClient.post<Todo>("/todos", newTodo);
    return response.data;
  },

  async update(id: string, updates: Partial<Todo>): Promise<Todo | undefined> {
    if (useLocalStorage) {
      const todos = getFromStorage<Todo[]>(STORAGE_KEY, []);
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return undefined;

      const oldTodo = todos[index];
      const editHistory = [...oldTodo.editHistory];

      for (const [key, newValue] of Object.entries(updates)) {
        if (key === "editHistory" || key === "updatedAt") continue;
        const oldValue = oldTodo[key as keyof Todo];
        if (oldValue !== newValue) {
          editHistory.push({
            timestamp: new Date().toISOString(),
            field: key,
            oldValue: String(oldValue),
            newValue: String(newValue),
          });
        }
      }

      const updatedTodo: Todo = {
        ...oldTodo,
        ...updates,
        updatedAt: new Date().toISOString(),
        editHistory,
      };
      todos[index] = updatedTodo;
      setToStorage(STORAGE_KEY, todos);
      return updatedTodo;
    }
    const response = await apiClient.patch<Todo>(`/todos/${id}`, updates);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (useLocalStorage) {
      const todos = getFromStorage<Todo[]>(STORAGE_KEY, []);
      setToStorage(
        STORAGE_KEY,
        todos.filter((t) => t.id !== id)
      );
      return;
    }
    await apiClient.delete(`/todos/${id}`);
  },

  async deleteCompleted(): Promise<void> {
    if (useLocalStorage) {
      const todos = getFromStorage<Todo[]>(STORAGE_KEY, []);
      setToStorage(
        STORAGE_KEY,
        todos.filter((t) => t.status !== "completed")
      );
      return;
    }
    await apiClient.delete("/todos/completed");
  },
};
