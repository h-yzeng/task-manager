import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import TaskDetailClient from "./task-detail-client";
import type { Metadata } from "next";
import type { TaskPriority } from "@/types";

interface TaskDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TaskDetailProps): Promise<Metadata> {
  const { id } = await params;
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, parseInt(id, 10)),
  });

  if (!task) {
    return { title: "Task Not Found" };
  }

  return {
    title: task.title,
    description: task.description || `View details for task: ${task.title}`,
  };
}

export default async function TaskDetailPage(props: TaskDetailProps) {
  const { id } = await props.params;

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, parseInt(id, 10)),
    with: {
      category: true,
    },
  });

  if (!task) {
    notFound();
  }

  // Transform to match Task type
  const taskData = {
    id: task.id.toString(),
    title: task.title,
    description: task.description,
    priority: task.priority as TaskPriority,
    completed: task.completed,
    dueDate: task.dueDate?.toISOString() || null,
    createdAt: task.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: task.updatedAt?.toISOString() || undefined,
    completedAt: task.completedAt?.toISOString() || null,
    category: task.category
      ? { id: task.category.id.toString(), name: task.category.name, color: task.category.color }
      : undefined,
  };

  return <TaskDetailClient task={taskData} />;
}