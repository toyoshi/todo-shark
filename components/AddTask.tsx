// components/AddTask.tsx
import { useState } from "react";
import { addTask } from "../lib/tasks";

interface AddTaskProps {
  onTaskAdded: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;
    await addTask({ title: title.trim(), estimated_time: estimatedTime, status: 'not_started' });
    setTitle("");
    setEstimatedTime(0);
    onTaskAdded();
  };

  return (
    <form className="bg-white shadow-md rounded p-6 flex space-x-2 mt-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-gray-300 rounded py-2 px-3 w-full"
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        className="border-2 border-gray-300 rounded py-2 px-3 w-32"
        placeholder="Estimated time"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </form>
  );
};

export default AddTask;
