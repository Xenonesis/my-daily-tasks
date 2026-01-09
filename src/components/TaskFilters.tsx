import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'completed' | 'incomplete';
  onStatusFilterChange: (status: 'all' | 'completed' | 'incomplete') => void;
}

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'incomplete', label: 'Active' },
  { value: 'completed', label: 'Completed' },
] as const;

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TaskFiltersProps) {
  return (
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
      
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex rounded-lg border border-border overflow-hidden">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilterChange(option.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
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
    </div>
  );
}
