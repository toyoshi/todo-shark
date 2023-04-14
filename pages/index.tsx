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
import CurrentTime from '../components/CurrentTime';
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
    <div className="drawer drawer-end">
      <input id="chat-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="container mx-auto p-4">


          
          <div className="stats shadow mb-4">
            <div className="stat place-items-center">
              <div className="stat-title">現在時刻</div>
              <div className="stat-value text-secondary">
                <CurrentTime />
              </div>
              <div className="stat-desc">From January 1st to February 1st</div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">予定終了時刻</div>
              <div className="stat-value text-secondary">
                <EstimatedEndTime tasks={tasks} />
              </div>
              <div className="stat-desc">From January 1st to February 1st</div>
            </div>


          </div>

          {user ? (
            <>
              <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
              <AddTask onTaskAdded={fetchTasks} />
            </>
          ) : (
            <SupabaseAuth />
          )}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="chat-drawer" className="drawer-overlay"></label>
        <div className="p-4 w-[40rem] bg-base-100 text-base-content">
          {/* ここにチャットのコンテンツを配置 */}
        </div>
      </div>
    </div>
  );
};

export default Home;
