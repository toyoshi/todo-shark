import { supabase } from './supabaseClient';

export type TimeRecord = {
  id: number;
  task_id: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

export async function createTaskTimeRecord(taskId: number) {
  const { data, error } = await supabase
    .from('time_records')
    .insert([{ task_id: taskId, start_time: new Date() }])
    .single();
  if (error) throw error;
  return data;
}

export async function updateTaskTimeRecord(id: number, end_time: string) {
  const { data, error } = await supabase
    .from('time_records')
    .update({ end_time })
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
