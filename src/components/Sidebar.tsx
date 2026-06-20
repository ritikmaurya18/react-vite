import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListTodo, Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const APP_NAME = import.meta.env.VITE_APP_NAME || "TodoApp";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/todos", label: "Todos", icon: ListTodo },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-background transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-bold">{APP_NAME}</h2>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
