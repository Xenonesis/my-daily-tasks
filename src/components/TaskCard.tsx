import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Trash2, Edit2, X, Save } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => Promise<unknown>;
  onUpdate: (id: string, updates: { title?: string; description?: string }) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

export function TaskCard({ task, onToggle, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group relative p-4 rounded-xl bg-card border border-border transition-all duration-200',
        'hover:shadow-md hover:border-accent/30',
        task.status === 'completed' && 'opacity-60'
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
            <h3
              className={cn(
                'font-medium text-foreground transition-all',
                task.status === 'completed' && 'line-through text-muted-foreground'
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground/60">
              {new Date(task.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
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
