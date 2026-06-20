import apiClient from "./client";
import type { Category } from "@/types/category";
import { getFromStorage, setToStorage } from "@/lib/localStorage";

const STORAGE_KEY = "todo_categories";

const useLocalStorage = true;

export const categoryService = {
  async getAll(): Promise<Category[]> {
    if (useLocalStorage) {
      return getFromStorage<Category[]>(STORAGE_KEY, []);
    }
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  async create(category: Omit<Category, "id" | "createdAt">): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
    };

    if (useLocalStorage) {
      const categories = getFromStorage<Category[]>(STORAGE_KEY, []);
      categories.push(newCategory);
      setToStorage(STORAGE_KEY, categories);
      return newCategory;
    }
    const response = await apiClient.post<Category>("/categories", newCategory);
    return response.data;
  },

  async update(id: string, updates: Partial<Category>): Promise<Category | undefined> {
    if (useLocalStorage) {
      const categories = getFromStorage<Category[]>(STORAGE_KEY, []);
      const index = categories.findIndex((c) => c.id === id);
      if (index === -1) return undefined;
      categories[index] = { ...categories[index], ...updates };
      setToStorage(STORAGE_KEY, categories);
      return categories[index];
    }
    const response = await apiClient.patch<Category>(`/categories/${id}`, updates);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (useLocalStorage) {
      const categories = getFromStorage<Category[]>(STORAGE_KEY, []);
      setToStorage(
        STORAGE_KEY,
        categories.filter((c) => c.id !== id)
      );
      return;
    }
    await apiClient.delete(`/categories/${id}`);
  },
};
