import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';

interface TaskStatsProps {
  tasks: Task[];
  totalCount: number;
}

export function TaskStats({ tasks, totalCount }: TaskStatsProps) {
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const incompleteCount = tasks.filter(t => t.status === 'incomplete').length;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalCount,
      icon: ListTodo,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Active',
      value: incompleteCount,
      icon: Circle,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
        >
          <div className={cn('p-2 rounded-lg', stat.bgColor)}>
            <stat.icon className={cn('w-5 h-5', stat.color)} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
