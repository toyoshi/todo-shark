// components/TaskItem.tsx
import { useState, useEffect } from 'react';
import { Task, updateTask, deleteTask } from '../lib/tasks';
import { updateTaskStatus } from '../lib/tasks';
import { useInterval } from '../lib/hooks';
import {
  TimeRecord,
  createTimeRecord,
  getTimeRecordsByTaskId,
  updateTimeRecord,
  getIncompleteTimeRecordByTaskId,
  getTotalTimeSpent
} from '../lib/TimeRecords';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause, faCircleCheck, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(task.title);
  const [actualTime, setActualTime] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

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

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    (async () => {
      const totalTime = await getTotalTimeSpent(task.id);
      setActualTime(totalTime);
      setIsCounting(task.status === 'in_progress');
    })();
  }, [task]);

  useInterval(() => {
    if (isCounting) {
      setActualTime(actualTime + 1000);
    }
  }, 1000);


  return (
    <tr className={task.status === 'in_progress' ? 'bg-green-100' : task.status === 'completed' ? 'bg-gray-200' : ''}>
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
      <td className="px-6 py-4 text-center whitespace-nowrap">
        {task.estimated_time} <span className="text-gray-500 text-xs">min</span>
      </td>
      <td className="px-6 py-4 text-center whitespace-nowrap">{formatTime(actualTime)}</td>
      <td className="py-2 px-4 text-right">
        <button
          onClick={task.status === 'not_started' ? handleStart : handlePause}
          className={`mr-2 bg-transparent hover:bg-gray-500 text-gray-700 hover:text-white py-1 px-4 border border-gray-500 hover:border-transparent rounded ${task.status === 'not_started' || task.status === 'paused' ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={task.status !== 'not_started' && task.status !== 'paused'}
        >開始
        </button>
        <button
          onClick={handlePause}
          className={`mr-2 bg-transparent hover:bg-gray-500 text-gray-700 hover:text-white py-1 px-4 border border-gray-500 hover:border-transparent rounded ${task.status === 'in_progress' ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={task.status !== 'in_progress'}
        >
          一時停止
        </button>
        <button
          onClick={handleComplete}
          className={`mr-2 bg-transparent hover:bg-gray-500 text-gray-700 hover:text-white py-1 px-4 border border-gray-500 hover:border-transparent rounded ${task.status !== 'completed' ? '' : 'opacity-50 cursor-not-allowed'
            }`}
          disabled={task.status === 'completed'}
        >
          終了
        </button>
        <button onClick={handleDelete} className="bg-transparent hover:bg-gray-500 text-gray-700 hover:text-white py-1 px-2 border border-gray-500 hover:border-transparent rounded">
          削除
        </button>


      </td>
    </tr>
  );
};

export default TaskItem;

