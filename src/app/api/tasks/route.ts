import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq, desc, and, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);

    // Get filter params
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build conditions
    const conditions = [eq(schema.tasks.userId, userId)];

    if (status === "active") {
      conditions.push(eq(schema.tasks.completed, false));
    } else if (status === "completed") {
      conditions.push(eq(schema.tasks.completed, true));
    }

    if (priority && priority !== "all") {
      conditions.push(eq(schema.tasks.priority, priority));
    }

    // Get tasks with category
    let query = db
      .select({
        id: schema.tasks.id,
        title: schema.tasks.title,
        description: schema.tasks.description,
        priority: schema.tasks.priority,
        completed: schema.tasks.completed,
        dueDate: schema.tasks.dueDate,
        completedAt: schema.tasks.completedAt,
        categoryId: schema.tasks.categoryId,
        position: schema.tasks.position,
        userId: schema.tasks.userId,
        createdAt: schema.tasks.createdAt,
        updatedAt: schema.tasks.updatedAt,
        categoryName: schema.categories.name,
        categoryColor: schema.categories.color,
      })
      .from(schema.tasks)
      .leftJoin(
        schema.categories,
        eq(schema.tasks.categoryId, schema.categories.id)
      )
      .where(and(...conditions))
      .$dynamic();

    // Apply sorting
    const sortColumn =
      {
        dueDate: schema.tasks.dueDate,
        priority: schema.tasks.priority,
        createdAt: schema.tasks.createdAt,
        title: schema.tasks.title,
      }[sortBy] || schema.tasks.createdAt;

    if (sortOrder === "asc") {
      query = query.orderBy(asc(sortColumn));
    } else {
      query = query.orderBy(desc(sortColumn));
    }

    const tasks = await query;

    // Filter by search in JS (simpler for now)
    let filteredTasks = tasks;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Transform to include category object
    const transformedTasks = filteredTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      completed: task.completed,
      dueDate: task.dueDate?.toISOString() || null,
      completedAt: task.completedAt?.toISOString() || null,
      categoryId: task.categoryId,
      position: task.position,
      userId: task.userId,
      createdAt: task.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: task.updatedAt?.toISOString() || new Date().toISOString(),
      category: task.categoryId
        ? {
            id: task.categoryId,
            name: task.categoryName,
            color: task.categoryColor,
          }
        : null,
    }));

    return NextResponse.json(transformedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);

    const [newTask] = await db
      .insert(schema.tasks)
      .values({
        title: body.title,
        description: body.description || null,
        priority: body.priority || "medium",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        categoryId: body.categoryId || null,
        completed: false,
        userId,
      })
      .returning();

    return NextResponse.json(
      {
        task: {
          ...newTask,
          dueDate: newTask.dueDate?.toISOString() || null,
          completedAt: newTask.completedAt?.toISOString() || null,
          createdAt:
            newTask.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt:
            newTask.updatedAt?.toISOString() || new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
