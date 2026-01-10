-- Add due_date and priority columns to tasks table
ALTER TABLE public.tasks 
ADD COLUMN due_date DATE,
ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));

-- Add index for due_date for better performance
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);