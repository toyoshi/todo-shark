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
        <ul>
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No tasks yet.</p>
      )}
    </div>
  );
};

export default TaskList;
