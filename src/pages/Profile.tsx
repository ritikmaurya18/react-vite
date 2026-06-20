import { useAuth } from "@/context/AuthContext";
import { useTodos } from "@/context/TodoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, RotateCcw } from "lucide-react";

const APP_NAME = import.meta.env.VITE_APP_NAME || "TodoApp";
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
const ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === "true";
const MAX_TODO_ITEMS = import.meta.env.VITE_MAX_TODO_ITEMS || "50";

export function Profile() {
  const { user, logout } = useAuth();
  const { resetData, todos, categories } = useTodos();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">Account and application settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-lg font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="destructive" onClick={logout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">App Name</span>
              <span className="text-sm font-medium">{APP_NAME}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">{APP_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">API Base URL</span>
              <span className="text-sm font-medium">{API_BASE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Analytics</span>
              <span className="text-sm font-medium">{ANALYTICS_ENABLED ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Todos</span>
              <span className="text-sm font-medium">{MAX_TODO_ITEMS}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Todos</span>
              <span className="text-sm font-medium">{todos.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Categories</span>
              <span className="text-sm font-medium">{categories.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Reset all data to the original sample todos and categories.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("Reset all data? This will replace your todos with sample data.")) {
                resetData();
              }
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
