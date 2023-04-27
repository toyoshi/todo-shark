// lib/tasks.ts
export interface Task {
  id: number;
  user_id: string;
  title: string;
  estimated_time: number;
  actual_time: number;
  due_date: string;
  label_ids: string[];
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
}
