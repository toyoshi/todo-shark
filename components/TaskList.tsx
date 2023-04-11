// components/TaskList.tsx
import { useEffect, useState } from 'react';
import { Task } from '../lib/tasks';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated }) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
      {filteredTasks.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Time
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 bg-gray-50"></th>
              <th className="px-6 py-3 bg-gray-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
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
