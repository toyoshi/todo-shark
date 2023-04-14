import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../lib/hooks";
import { Task } from "../types/task";
import { getVisibleTasks } from '../lib/tasks';
import SupabaseAuth from "../components/SupabaseAuth";
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';
import EstimatedEndTime from '../components/EstimatedEndTime';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";

const Home: NextPage = () => {
  const { user, loading } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    if (user) {
      const fetchedTasks: any = await getVisibleTasks(user.id); //TODO: use any
      setTasks(fetchedTasks);
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
      <EstimatedEndTime tasks={tasks} />
      {user ? (
        <>
          <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
          <AddTask onTaskAdded={fetchTasks} />
        </>
      ) : (
        <SupabaseAuth />
      )}
    </div>
  );
};

export default Home;
