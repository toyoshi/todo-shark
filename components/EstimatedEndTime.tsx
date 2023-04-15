// components/EstimatedEndTime.tsx
import { useEffect, useState } from 'react';
import { Task } from "../types/task";

interface EstimatedEndTimeProps {
  tasks: Task[];
}

const EstimatedEndTime: React.FC<EstimatedEndTimeProps> = ({ tasks }) => {
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [totalEstimatedTimeInMinutes, setTotalEstimatedTimeInMinutes] = useState(0);

  const calculateEndTime = () => {
    const now = new Date();
    const totalEstimatedTimeInMinutes = tasks
      .filter((task) => task.status !== 'completed')
      .reduce((acc, task) => acc + task.estimated_time, 0);
    const endTime = new Date(now.getTime() + totalEstimatedTimeInMinutes * 60 * 1000);
    setTotalEstimatedTimeInMinutes(totalEstimatedTimeInMinutes);
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
    <>
      <div className="stat place-items-center">
        <div className="stat-title">予定終了時刻</div>
        <div className="stat-value text-secondary">
          {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="stat-desc">
          合計{totalEstimatedTimeInMinutes}分
        </div>
      </div>
    </>
  );
};

export default EstimatedEndTime;
