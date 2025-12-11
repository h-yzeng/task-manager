"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Loader2, Inbox, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskList, TaskFilters as FiltersBar, TaskStats, TaskForm } from "@/components/tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Task, Category, TaskFilters } from "@/types";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    priority: "all",
    sortBy: "dueDate",
    sortOrder: "asc",
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.priority !== "all") params.append("priority", filters.priority);
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      } else if (res.status === 401) {
        // User needs to sign in again
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
      fetchCategories();
    }
  }, [status, fetchTasks, fetchCategories]);

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, completed, completedAt: completed ? new Date().toISOString() : null }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const handleQuickAddSuccess = () => {
    setShowQuickAdd(false);
    fetchTasks();
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (status === "unauthenticated") {
    return (
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to TaskFlow
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, feature-rich task management application to help you stay
              organized and productive.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={() => router.push("/auth/signin")} className="text-base">
              Get Started
            </Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
            {[
              {
                title: "Organize Tasks",
                description: "Create, categorize, and prioritize your tasks efficiently",
              },
              {
                title: "Track Progress",
                description: "Monitor your productivity with visual statistics",
              },
              {
                title: "Stay Focused",
                description: "Use due dates and reminders to never miss a deadline",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="rounded-lg border bg-card p-6 text-left hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Main dashboard for authenticated users
  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s an overview of your tasks
            </p>
          </div>
          <Button onClick={() => setShowQuickAdd(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>

        {/* Stats Section */}
        <TaskStats tasks={tasks} />

        {/* Filters Section */}
        <FiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              {filters.status !== "all" ||
              filters.priority !== "all" ||
              filters.search
                ? "Try adjusting your filters to see more tasks"
                : "Get started by creating your first task"}
            </p>
            <Button onClick={() => setShowQuickAdd(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </motion.div>
        ) : (
          <TaskList
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskDelete={handleTaskDelete}
            onTaskClick={handleTaskClick}
          />
        )}

        {/* Quick Add Dialog */}
        <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              categories={categories}
              onSuccess={handleQuickAddSuccess}
              onCancel={() => setShowQuickAdd(false)}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
