# My Daily Tasks

A modern, responsive task management application built with React, TypeScript, and Supabase. Manage your daily tasks with ease, featuring user authentication, task creation, editing, filtering, and statistics.

## Features

- **User Authentication**: Secure login and signup using Supabase Auth
- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Task Filtering**: Filter tasks by status (completed/incomplete)
- **Task Statistics**: View task completion stats and progress
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui with Radix UI components
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (v18 or higher) or Bun
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Xenonesis/my-daily-tasks.git
   cd my-daily-tasks
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Run the database migration:
     ```bash
     supabase db push
     ```
     Or apply the migration manually from `supabase/migrations/20260109035056_719b7e03-e412-49d4-b2d1-5c1bc30fbfad.sql`

4. **Environment Variables**

   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components (TaskCard, etc.)
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom hooks (useTasks, etc.)
├── integrations/       # External integrations (Supabase)
├── lib/                # Utility functions
├── pages/              # Page components (Dashboard, Auth, etc.)
└── ...
```

## Deployment

This app can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider.

For Vercel:
```bash
npm i -g vercel
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
