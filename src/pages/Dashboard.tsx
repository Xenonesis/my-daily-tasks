import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, LogOut, Loader2, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskStats } from '@/components/TaskStats';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [page, setPage] = useState(1);
  
  const { tasks, loading, totalCount, totalPages, createTask, updateTask, toggleTask, deleteTask } = useTasks({
    searchQuery,
    statusFilter,
    page,
    limit: 20,
  });

  // Debounce search
  const debouncedSearch = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchQuery(value);
        setPage(1);
      }, 300);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">TaskFlow</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
              <p className="text-muted-foreground mt-1">
                Organize and track your daily tasks
              </p>
            </div>
            <CreateTaskDialog onCreate={createTask} />
          </div>

          {/* Stats */}
          <TaskStats tasks={tasks} totalCount={totalCount} />

          {/* Filters */}
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={debouncedSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={(status) => {
              setStatusFilter(status);
              setPage(1);
            }}
          />

          {/* Task List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  {searchQuery || statusFilter !== 'all' ? 'No tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first task to get started. Stay organized and productive!'}
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
