// components/AddTask.tsx
import { useState } from "react";
import { addTask } from "../lib/tasks";
import { labels } from '../lib/labels';

interface AddTaskProps {
  onTaskAdded: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;
    await addTask({ title: title.trim(), estimated_time: estimatedTime, status: 'not_started', label_ids: selectedLabels });
    setTitle("");
    setEstimatedTime(0);
    onTaskAdded();
  };

  const handleLabelChange = (label: { id: string }, checked: boolean) => {
    if (checked) {
      setSelectedLabels((prevSelectedLabels) => [...prevSelectedLabels, label.id]);
    } else {
      setSelectedLabels((prevSelectedLabels) =>
        prevSelectedLabels.filter((id) => id !== label.id)
      );
    }
  };

  return (
    <form className="space-x-2 mt-4" onSubmit={handleSubmit}>
      <div className="flex">
      <input
        type="text"
        className="input input-bordered w-full mr-2"
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
      </div>
      <div>
      <div className="mt-2 mb-2">
        {labels.map((label) => (
          <label key={label.id} className="mr-3">
            <input
              type="checkbox"
              className="mr-1"
              onChange={(e) => handleLabelChange(label, e.target.checked)}
            />
            {label.name}
          </label>
        ))}
      </div>
      </div>
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
