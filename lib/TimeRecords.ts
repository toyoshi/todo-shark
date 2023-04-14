import { supabase } from './supabaseClient';

export interface TimeRecord {
    id: number;
    task_id: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export const createTimeRecord = async (task_id: number, start_time: string) => {
    const { data, error } = await supabase.from('time_records').insert([
        { task_id, start_time },
    ]);

    if (error) {
        console.log('Error creating time record:', error.message);
    }

    return data;
};

export const getTimeRecordsByTaskId = async (task_id: number) => {
    const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('task_id', task_id);

    if (error) {
        console.log('Error getting time records:', error.message);
    }

    return data;
};

export const updateTimeRecord = async (id: number, updates: Partial<TimeRecord>) => {
    const { data, error } = await supabase
        .from('time_records')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.log('Error updating time record:', error.message);
    }

    return data;
};

export const deleteTimeRecord = async (id: number) => {
    const { data, error } = await supabase
        .from('time_records')
        .delete()
        .eq('id', id);

    if (error) {
        console.log('Error deleting time record:', error.message);
    }

    return data;
};

export const getIncompleteTimeRecordByTaskId = async (taskId: number) => {
    const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('task_id', taskId)
        .is('end_time', null)
        .order('start_time', { ascending: false })
        .single();

    if (error) {
        console.error('Error fetching incomplete time record by task ID:', error);
        throw error;
    }

    return data;
};

export const getTotalTimeSpent = async (taskId: number): Promise<number> => {
  const { data: timeRecords, error } = await supabase
    .from('time_records')
    .select('*')
    .eq('task_id', taskId);

  if (error) throw error;

  return timeRecords.reduce((total, record) => {
    const startTime = new Date(record.start_time).getTime();
    const endTime = record.end_time ? new Date(record.end_time).getTime() : Date.now();
    return total + (endTime - startTime);
  }, 0);
};
