// types/task.d.ts
export interface Task {
    id?: number;
    title: string;
    completed?: boolean;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
  }