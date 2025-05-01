# Task Manager

A full-stack task management application built with Next.js 15, TypeScript, Tailwind CSS, and Vercel Postgres.

## Features

- Create, read, update, and delete tasks
- Set task priorities (low, medium, high)
- Track task status (pending, in progress, completed)
- Set due dates for tasks
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres (powered by Neon)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Git
- Vercel account (for deployment and database)

### Local Development

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager

2. Install dependencies:

   ```bash
   npm install

3. Run the development server:

   ```bash
   npm run dev

4. Open http://localhost:3000 in your browser to see the application.

### Database Setup

The application automatically initializes the database with the necessary tables when it starts. If you need to manually initialize the database, you can visit the `/api/init` endpoint in your browser.

## Deployment

This application is deployed on Vercel with a Postgres database:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy your application
