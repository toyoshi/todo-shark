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
    <form className="flex space-x-2 mt-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        className="input input-bordered max-w-xs w-32"
        placeholder="Estimated time"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
      />
      <button
        type="submit"
        className="btn btn-primary"
      >
        Add
      </button>
    </form>
  );
};

export default AddTask;
