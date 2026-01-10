import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Priority } from '@/hooks/useTasks';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'completed' | 'incomplete';
  onStatusFilterChange: (status: 'all' | 'completed' | 'incomplete') => void;
  priorityFilter: 'all' | Priority;
  onPriorityFilterChange: (priority: 'all' | Priority) => void;
}

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'incomplete', label: 'Active' },
  { value: 'completed', label: 'Completed' },
] as const;

const priorityOptions = [
  { value: 'all', label: 'Any Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
] as const;

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-lg border border-border overflow-hidden">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onStatusFilterChange(option.value)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium transition-colors',
                    statusFilter === option.value
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex rounded-lg border border-border overflow-hidden">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onPriorityFilterChange(option.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors',
                  priorityFilter === option.value
                    ? option.value === 'high'
                      ? 'bg-destructive/20 text-destructive'
                      : option.value === 'medium'
                      ? 'bg-warning/20 text-warning-foreground'
                      : option.value === 'low'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-accent text-accent-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
