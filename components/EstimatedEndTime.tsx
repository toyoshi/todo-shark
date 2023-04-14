// components/EstimatedEndTime.tsx
import { useEffect, useState } from 'react';
import { Task } from "../types/task";

interface EstimatedEndTimeProps {
  tasks: Task[];
}

const EstimatedEndTime: React.FC<EstimatedEndTimeProps> = ({ tasks }) => {
  const [endTime, setEndTime] = useState<Date | null>(null);

  const calculateEndTime = () => {
    const now = new Date();
    const totalEstimatedTimeInMinutes = tasks
        .filter((task) => task.status !== 'completed')
        .reduce((acc, task) => acc + task.estimated_time, 0);
    const endTime = new Date(now.getTime() + totalEstimatedTimeInMinutes * 60 * 1000);
    setEndTime(endTime);
  };

  useEffect(() => {
    calculateEndTime();
    const interval = setInterval(calculateEndTime, 60 * 1000); // 1分ごとに更新

    return () => {
      clearInterval(interval);
    };
  }, [tasks]);

  if (!endTime) {
    return null;
  }

  return (
    <h1 className="text-4xl font-bold text-center mb-8">
      {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </h1>
  );
};

export default EstimatedEndTime;
