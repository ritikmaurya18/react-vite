import { CategoryManager } from "@/components/CategoryManager";

export function Categories() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">Manage your todo categories and tags</p>
      </div>
      <CategoryManager />
    </div>
  );
}
