// lib/tasks.ts
import { Task } from "../types/task";
import { supabase } from "./supabaseClient";
import { isToday } from 'date-fns';

export async function getVisibleTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from<Task>('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching visible tasks:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.filter(
    (task) =>
      task.status !== 'completed' ||
      (task.created_at && isToday(new Date(task.created_at)))
  );
}

export const addTask = async (task: Task) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const { user } = session

  if (!user) {
    throw new Error("User must be authenticated to add tasks.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id: user.id }])
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// 既存の関数の後に追加
export async function deleteTask(taskId: number) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
  }
}

export const updateTaskStatus = async (taskId: number, status: Task['status']) => {
  const { error } = await supabase
    .from<Task>('tasks')
    .update({ status })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task status:', error);
  }
};