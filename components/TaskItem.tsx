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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause, faCircleCheck, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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
        <button onClick={task.status === 'not_started' ? handleStart : handlePause} className={task.status === 'not_started' || task.status === 'paused' ? '' : 'opacity-50 cursor-not-allowed'} disabled={task.status !== 'not_started' && task.status !== 'paused'}>
          <FontAwesomeIcon icon={task.status === 'not_started' ? faCirclePlay : faCirclePlay} className="mr-2 text-green-500 hover:text-green-600" size="2x" />
        </button>


        <button onClick={handlePause} className={task.status === 'in_progress' ? '' : 'opacity-50 cursor-not-allowed'} disabled={task.status !== 'in_progress'}>
          <FontAwesomeIcon icon={faCirclePause} className="mr-2 text-yellow-500 hover:text-yellow-600" size="2x" />
        </button>

        <button onClick={handleComplete} className={task.status !== 'completed' ? '' : 'opacity-50 cursor-not-allowed'} disabled={task.status === 'completed'}>
          <FontAwesomeIcon icon={faCircleCheck} className="mr-2 text-green-500 hover:text-green-600" size="2x" />
        </button>
        <button onClick={() => setIsEditing(true)} className="text-blue-500">
          <FontAwesomeIcon icon={faEdit} className="ml-4 mr-2 text-gray-500 hover:text-gray-600" size="2x" />
        </button>
        <button onClick={handleDelete} className="text-red-500">
          <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 hover:text-red-600" size="2x" />
        </button>
      </td>
    </tr>
  );
};

export default TaskItem;

