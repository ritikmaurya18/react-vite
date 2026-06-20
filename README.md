# React + Vite TODO App

A complete TODO management application built with React 18, Vite, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **TODO CRUD**: Create, read, update, and delete todos with title, description, priority, due date, category, and status
- **LocalStorage Persistence**: All data persists in localStorage with automatic hydration
- **Authentication**: Simple auth flow with protected routes (demo: `admin@example.com` / `password123`)
- **Dashboard**: Stats cards, recent todos, and quick-add form
- **Filtering & Sorting**: Filter by status, priority, category, search text; sort by due date, priority, or creation date
- **Pagination**: 10 items per page on the todo list
- **Categories**: Full CRUD for category/tag management
- **Edit History**: Track changes to each todo
- **Responsive Design**: Mobile-friendly sidebar navigation

## Tech Stack

- React 18 + TypeScript
- Vite (latest stable)
- Tailwind CSS v4
- shadcn/ui components
- react-router-dom v6
- axios
- lucide-react (icons)
- date-fns (date formatting)

## Environment Variables

Create a `.env` file in the project root with these 5 variables:

| Variable | Description | Example |
|---|---|---|
| `VITE_APP_NAME` | Displayed in header, sidebar, and browser tab | `TodoApp` |
| `VITE_APP_VERSION` | Shown on the Profile page | `1.0.0` |
| `VITE_API_BASE_URL` | Base URL for the axios API client | `http://localhost:3001/api` |
| `VITE_ENABLE_ANALYTICS` | Boolean flag to console.log analytics events on CRUD ops | `true` |
| `VITE_MAX_TODO_ITEMS` | Max todo count; shows warning and disables create when exceeded | `50` |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  main.tsx              # Entry point
  App.tsx               # Root component with routing
  pages/
    Login.tsx           # Login page
    Dashboard.tsx       # Dashboard with stats and quick add
    TodoList.tsx        # Full todo list with filters and pagination
    TodoDetail.tsx      # Todo detail view with edit history
    Categories.tsx      # Category management
    Profile.tsx         # User profile and app info
  components/
    Sidebar.tsx         # Navigation sidebar
    Header.tsx          # Top header bar
    TodoForm.tsx        # Todo create/edit form
    TodoFilter.tsx      # Filter and sort controls
    CategoryManager.tsx # Category CRUD component
    StatsCard.tsx       # Statistics card component
    ui/                 # shadcn/ui-style base components
  context/
    AuthContext.tsx      # Authentication context
    TodoContext.tsx      # Todo state management with useReducer
  api/
    client.ts           # Axios instance with VITE_API_BASE_URL
    todoService.ts      # Todo CRUD service
    categoryService.ts  # Category CRUD service
  lib/
    utils.ts            # Utility functions (cn, generateId)
    localStorage.ts     # Safe localStorage helpers
  types/
    todo.ts             # Todo type definitions
    category.ts         # Category type definitions
```

## Demo Credentials

- **Email**: admin@example.com
- **Password**: password123
