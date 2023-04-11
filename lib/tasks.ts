// lib/tasks.ts
import { Task } from "../types/Task";
import { supabase } from "./supabaseClient";

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
