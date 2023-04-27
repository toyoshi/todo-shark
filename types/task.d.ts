// lib/tasks.ts
export interface Task {
  id: number;
  user_id: string;
  title: string;
  estimated_time: number;
  actual_time: number;
  start_time: string | null;
  end_time: string | null;
  due_date: string;
  label_ids: string[];
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
}
