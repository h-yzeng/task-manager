import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" && user.email) {
        try {
          // Check if user exists
          const existingUser = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.githubId, account.providerAccountId))
            .limit(1);

          if (existingUser.length === 0) {
            // Create new user
            const [newUser] = await db
              .insert(schema.users)
              .values({
                name: user.name,
                email: user.email,
                image: user.image,
                githubId: account.providerAccountId,
              })
              .returning();

            // Create default categories for new user
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
                userId: newUser.id,
              }))
            );
          } else {
            // Update existing user
            await db
              .update(schema.users)
              .set({
                name: user.name,
                email: user.email,
                image: user.image,
                updatedAt: new Date(),
              })
              .where(eq(schema.users.githubId, account.providerAccountId));
          }
        } catch (error) {
          console.error("Error managing user:", error);
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.githubId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.githubId) {
        try {
          const user = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.githubId, token.githubId as string))
            .limit(1);

          if (user.length > 0) {
            session.user.id = user[0].id.toString();
          }
        } catch (error) {
          console.error("Error fetching user for session:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
