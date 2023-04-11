import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../lib/hooks";
import SupabaseAuth from "../components/SupabaseAuth";
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';


const Home: NextPage = () => {
  const { user, loading } = useUser();

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    if (user) {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(tasks);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Todo Shark</h1>
      {user ? (
        <>
          <AddTask onTaskAdded={fetchTasks} />
          <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
        </>
      ) : (
        <SupabaseAuth />
      )}
    </div>
  );
};

export default Home;
