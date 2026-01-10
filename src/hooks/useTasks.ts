import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'completed' | 'incomplete';
  priority: Priority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface UseTasksOptions {
  searchQuery?: string;
  statusFilter?: 'all' | 'completed' | 'incomplete';
  priorityFilter?: 'all' | Priority;
  page?: number;
  limit?: number;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { searchQuery = '', statusFilter = 'all', priorityFilter = 'all', page = 1, limit = 20 } = options;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    let query = supabase
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply status filter
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      query = query.eq('priority', priorityFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      query = query.ilike('title', `%${searchQuery.trim()}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      toast({
        title: 'Error fetching tasks',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setTasks((data as Task[]) || []);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  }, [user, searchQuery, statusFilter, priorityFilter, page, limit, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (title: string, description?: string, priority: Priority = 'medium', dueDate?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        user_id: user.id,
        status: 'incomplete',
        priority,
        due_date: dueDate || null,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error creating task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: 'Task created',
      description: 'Your new task has been added.',
    });
    
    await fetchTasks();
    return { data, error: null };
  };

  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'due_date'>>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: 'Task updated',
      description: 'Your task has been updated.',
    });
    
    await fetchTasks();
    return { data, error: null };
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return { error: new Error('Task not found') };

    const newStatus = task.status === 'completed' ? 'incomplete' : 'completed';
    
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error toggling task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: newStatus === 'completed' ? 'Task completed!' : 'Task reopened',
      description: newStatus === 'completed' ? 'Great job!' : 'Task marked as incomplete.',
    });
    
    await fetchTasks();
    return { data, error: null };
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: 'Task deleted',
      description: 'Your task has been removed.',
    });
    
    await fetchTasks();
    return { error: null };
  };

  return {
    tasks,
    loading,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
