// components/TaskItem.tsx
import { useState } from 'react';
import { Task, updateTask, deleteTask } from '../lib/tasks';
import { updateTaskStatus } from '../lib/tasks';
import {
  TimeRecord,
  createTimeRecord,
  getTimeRecordsByTaskId,
  updateTimeRecord,
  getIncompleteTimeRecordByTaskId,
} from '../lib/timeRecords';

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

  const handleStart = async () => {
    const start_time = new Date().toISOString();
    await createTimeRecord(task.id, start_time);
    await updateTaskStatus(task.id, 'in_progress');
    onTaskUpdated();
  };

  const handlePause = async () => {
    const timeRecords = await getTimeRecordsByTaskId(task.id);
    const currentTimeRecord = timeRecords.find((record) => !record.end_time);
    if (currentTimeRecord) {
      const end_time = new Date().toISOString();
      await updateTimeRecord(currentTimeRecord.id, { end_time });
      await updateTaskStatus(task.id, 'not_started');
      onTaskUpdated();
    }
  };

  const handleComplete = async () => {
    const timeRecords = await getTimeRecordsByTaskId(task.id);
    const currentTimeRecord = timeRecords.find((record) => !record.end_time);
    if (currentTimeRecord) {
      const end_time = new Date().toISOString();
      await updateTimeRecord(currentTimeRecord.id, { end_time });
      await updateTaskStatus(task.id, 'completed');
      onTaskUpdated();
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            onBlur={handleUpdate}
            className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          />
        ) : (
          <span className="text-gray-800">{task.title}</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {task.estimated_time}
      </td>
      <td className="py-2 px-4">
      {task.status === 'not_started' && (
          <button onClick={handleStart} className="text-green-500">
            Start
          </button>
        )}
        {task.status === 'paused' && (
          <button onClick={handleStart} className="text-green-500">
            Restart
          </button>
        )}
        {task.status === 'in_progress' && (
          <button onClick={handlePause} className="text-yellow-500">
            Pause
          </button>
        )}
        {task.status !== 'completed' && (
          <button onClick={handleComplete} className="text-green-500">
            Complete
          </button>
        )}
        {task.status === 'completed' && (
          <button className="">
            Completed
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => setIsEditing(true)} className="text-blue-500">
          Edit
        </button>
        <button onClick={handleDelete} className="ml-4 text-red-500">
          Delete
        </button>
      </td>
    </tr>
  );
};

export default TaskItem;

