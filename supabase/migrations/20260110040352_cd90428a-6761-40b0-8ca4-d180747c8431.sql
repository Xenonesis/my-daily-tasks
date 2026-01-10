-- Add tags column to tasks table
ALTER TABLE public.tasks ADD COLUMN tags text[] DEFAULT '{}';

-- Create index for efficient tag searching
CREATE INDEX idx_tasks_tags ON public.tasks USING GIN(tags);