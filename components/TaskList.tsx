// components/TaskList.tsx
import { useEffect, useState } from 'react';
import { Table } from "daisyui";
import { Task } from '../lib/tasks';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated }) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null); //チャットが開かれているタスク

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      {filteredTasks.length > 0 ? (
        <table className="table w-full">
          <thead>
            <tr>
              <th className="tracking-wider">
                Title
              </th>
              <th className="">
                Estimated Time
              </th>
              <th className="">
                Time Spent
              </th>
              <th className=""></th>
            </tr>
          </thead>
          <tbody className="">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} selectedTaskId={selectedTaskId} onSelectedTaskIdChange={setSelectedTaskId} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No tasks yet.</p>
      )}
    </div>
  );
};

export default TaskList;
