# Task Manager

A lightweight, full-stack task management app deployed on Vercel. Task Manager lets you quickly organize, track, and update your to-do items from any device.

## Live Demo

[https://h-yzeng-task-manager.vercel.app](https://h-yzeng-task-manager.vercel.app)

---

## How It Works

1. **Homepage (Task List)**  
   - When you visit `/`, the server fetches all tasks from Vercel Postgres and renders them in a responsive grid.  
   - Each task card shows its **title**, **priority** (low/medium/high) and **status** (pending/in progress/completed), plus links to **View Details**, **Edit**, or **Delete**.

2. **Create New Task**  
   - Click **“Add New Task”** to go to `/tasks/new`.  
   - Fill in the **title**, **description**, **priority**, and **due date**, then submit.  
   - The form makes a `POST /api/tasks` request; the server inserts a new row and you’re redirected back to the updated task list.

3. **Task Details**  
   - Click **“View Details”** on any card to open `/tasks/[id]`.  
   - The page server-fetches that task by its ID (`GET /api/tasks/:id`) and displays all fields, including creation and last-updated timestamps.  
   - From here you can jump to **Edit** or hit the **Delete** button to remove it (`DELETE /api/tasks/:id`).

4. **Edit Task**  
   - On `/tasks/[id]/edit`, a client-side React form is prefilled by fetching `GET /api/tasks/:id`.  
   - Change any field (title, description, status, priority, due date) and submit.  
   - The page issues a `PUT /api/tasks/:id`, then returns you to the updated details view.

5. **Delete Task**  
   - The **Delete** button on the detail page sends `DELETE /api/tasks/:id` and, on success, navigates back to the task list.

---

## Architecture & Tech

- **Next.js v15 App Router**  
  - Server components fetch data via Route Handlers.  
  - Client components (`"use client"`) handle forms and navigation.

- **TypeScript**  
  - End-to-end type safety: from API routes to React props and SQL results.

- **Tailwind CSS**  
  - Utility-first styling for responsive, mobile-friendly UI.

- **Database: Vercel Postgres (Neon)**  
  - Serverless Postgres instance for persistent task storage.  
  - Accessed via a simple `executeQuery` wrapper in `src/lib/db`.

- **Deployment**  
  - Hosted on Vercel with automatic CI/CD.  
  - Every push to `main` rebuilds both the frontend and the database schema.

---

## Getting Started (User Guide)

1. **Open** the live site at [h-yzeng-task-manager.vercel.app](https://h-yzeng-task-manager.vercel.app).  
2. **View** your existing tasks or click **“Add New Task”**.  
3. **Fill out** the new-task form (Title is required; other fields are optional).  
4. **Submit** to see your task immediately added to the list.  
5. **Click** on any task card to view details, edit fields, or delete it.
