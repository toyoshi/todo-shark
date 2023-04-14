import { supabase } from './supabaseClient';

export async function getTaskConversations(taskId: number) {
  const { data, error } = await supabase
    .from('conversations')
    .select('messages')
    .eq('task_id', taskId)
    .single();

  if (error) {
    //console.error('Error fetching task conversations:', error);
  }

  return data ? data.messages : [];
}

export async function saveTaskConversations(taskId: number, messages: any) {
  const { data, error } = await supabase
    .from('conversations')
    .upsert({ task_id: taskId, messages }, { onConflict: 'task_id' }); // 一意性制約に合わせて修正

  if (error) {
    console.error('Error saving task conversations:', error);
  }

  return data;
}
