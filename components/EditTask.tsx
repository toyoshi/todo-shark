import { useState } from 'react';
import { Task, updateTask } from '../lib/tasks';

interface EditTaskProps {
  task: Task;
  onTaskUpdated: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onTaskUpdated }) => {
  const [title, setTitle] = useState(task.title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    await updateTask(task.id, { title: title.trim() });
    onTaskUpdated();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
      <div className="flex items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        />
        <button type="submit" className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Save
        </button>
      </div>
    </form>
  );
};

export default EditTask;
