import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Priority, SortField, SortDirection } from '@/hooks/useTasks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'completed' | 'incomplete';
  onStatusFilterChange: (status: 'all' | 'completed' | 'incomplete') => void;
  priorityFilter: 'all' | Priority;
  onPriorityFilterChange: (priority: 'all' | Priority) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
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

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortField,
  sortDirection,
  onSortChange,
}: TaskFiltersProps) {
  const currentSortLabel = sortOptions.find(o => o.value === sortField)?.label || 'Date Created';
  
  const handleSortFieldChange = (field: SortField) => {
    onSortChange(field, sortDirection);
  };

  const toggleSortDirection = () => {
    onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc');
  };

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
          {/* Sort Options */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentSortLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortFieldChange(option.value)}
                    className={cn(
                      sortField === option.value && 'bg-accent'
                    )}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortDirection}
              className="px-2"
              title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Status Filter */}
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
          
          {/* Priority Filter */}
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
