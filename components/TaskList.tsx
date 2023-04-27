// components/TaskList.tsx
import { useEffect, useState } from 'react';
import { Task } from '../types/task';
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
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      {filteredTasks.length > 0 ? (
        <table className="w-full text-left table-auto">
          <thead className="uppercase bg-base-200">
            <tr>
              <th className="px-6 py-3">
                Title
              </th>
              <th className="px-6 py-3">
                Estimated Time
              </th>
              <th className="px-6 py-3">
                Time Spent
              </th>
              <th className="px-6 py-3"></th>
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
