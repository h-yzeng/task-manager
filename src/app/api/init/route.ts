import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Initialize default categories for current user
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Check if user already has categories
    const existingCategories = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.userId, userId))
      .limit(1);

    if (existingCategories.length > 0) {
      return NextResponse.json({
        message: "Categories already exist",
        count: existingCategories.length,
      });
    }

    // Create default categories
    const defaultCategories = [
      { name: "Work", color: "#3b82f6", icon: "💼" },
      { name: "Personal", color: "#10b981", icon: "🏠" },
      { name: "Shopping", color: "#f59e0b", icon: "🛒" },
      { name: "Health", color: "#ef4444", icon: "❤️" },
      { name: "Learning", color: "#8b5cf6", icon: "📚" },
    ];

    await db.insert(schema.categories).values(
      defaultCategories.map((cat) => ({
        ...cat,
        userId,
      }))
    );

    return NextResponse.json({
      message: "Default categories created successfully",
      count: defaultCategories.length,
    });
  } catch (error) {
    console.error("Error initializing categories:", error);
    return NextResponse.json(
      { error: "Failed to initialize categories" },
      { status: 500 }
    );
  }
}
