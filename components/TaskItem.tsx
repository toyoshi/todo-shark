import { useState } from 'react';
import { Task, updateTask, deleteTask } from '../lib/tasks';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(task.title);

  const handleUpdate = async () => {
    if (updatedTitle.trim() === '') return;
    await updateTask(task.id, { title: updatedTitle.trim() });
    setIsEditing(false);
    onTaskUpdated();
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onTaskUpdated();
  };

  return (
    <li className="border-b border-gray-200 py-4">
      {isEditing ? (
        <input
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          onBlur={handleUpdate}
          className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        />
      ) : (
        <>
          <span className="text-gray-800">{task.title}</span>
          <button onClick={() => setIsEditing(true)} className="ml-4 text-blue-500">
            Edit
          </button>
          <button onClick={handleDelete} className="ml-4 text-red-500">
            Delete
          </button>
        </>
      )}
    </li>
  );
};

export default TaskItem;
