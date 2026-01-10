import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit2, X, Save, Calendar, AlertTriangle } from 'lucide-react';
import { Task, Priority } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { TagInput, TagDisplay } from '@/components/TagInput';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => Promise<unknown>;
  onUpdate: (id: string, updates: { title?: string; description?: string; priority?: Priority; due_date?: string | null; tags?: string[] }) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground hover:bg-muted' },
  medium: { label: 'Medium', className: 'bg-warning/20 text-warning-foreground hover:bg-warning/30' },
  high: { label: 'High', className: 'bg-destructive/20 text-destructive hover:bg-destructive/30' },
};

export function TaskCard({ task, onToggle, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.due_date || '');
  const [editTags, setEditTags] = useState<string[]>(task.tags || []);
  const [isLoading, setIsLoading] = useState(false);

  const isOverdue = task.due_date && task.status !== 'completed' && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
  const isDueToday = task.due_date && isToday(new Date(task.due_date));

  const handleToggle = async () => {
    setIsLoading(true);
    await onToggle(task.id);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsLoading(true);
    await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      priority: editPriority,
      due_date: editDueDate || null,
      tags: editTags,
    });
    setIsEditing(false);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete(task.id);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.due_date || '');
    setEditTags(task.tags || []);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group relative p-4 rounded-xl bg-card border transition-all duration-200',
        'hover:shadow-md',
        task.status === 'completed' && 'opacity-60',
        isOverdue ? 'border-destructive/50 bg-destructive/5' : 'border-border hover:border-accent/30'
      )}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            className="font-medium"
            disabled={isLoading}
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            className="resize-none"
            rows={2}
            disabled={isLoading}
          />
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Priority:</label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                disabled={isLoading}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Due:</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                disabled={isLoading}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Tags:</label>
            <TagInput tags={editTags} onChange={setEditTags} disabled={isLoading} />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || !editTitle.trim()}
              className="bg-accent hover:bg-accent/90"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
              'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200',
              'hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50',
              task.status === 'completed'
                ? 'bg-success border-success'
                : 'border-muted-foreground/40'
            )}
          >
            {task.status === 'completed' && (
              <Check className="w-full h-full p-0.5 text-success-foreground" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={cn(
                  'font-medium text-foreground transition-all',
                  task.status === 'completed' && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </h3>
              <Badge variant="outline" className={cn('text-xs', priorityConfig[task.priority].className)}>
                {priorityConfig[task.priority].label}
              </Badge>
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-2">
                <TagDisplay tags={task.tags} />
              </div>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground/60">
              <span>
                {new Date(task.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {task.due_date && (
                <span className={cn(
                  'flex items-center gap-1',
                  isOverdue && 'text-destructive font-medium',
                  isDueToday && 'text-warning font-medium'
                )}>
                  {isOverdue && <AlertTriangle className="w-3 h-3" />}
                  <Calendar className="w-3 h-3" />
                  {isOverdue ? 'Overdue: ' : isDueToday ? 'Due today: ' : 'Due: '}
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
