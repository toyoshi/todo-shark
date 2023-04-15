import React, { useState, useEffect } from "react";

const CurrentTime: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<string>("");

    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}`);
    };

    const updateDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const date = String(now.getDate()).padStart(2, "0");
        const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][now.getDay()];
        setCurrentDate(`${year}年${month}月${date}日（${dayOfWeek}）`);
    };

    useEffect(() => {
        updateTime();
        updateDate();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="stat place-items-center">
            <div className="stat-title">現在時刻</div>
            <div className="stat-value text-secondary">
                {currentTime}
            </div>
            <div className="stat-desc">{currentDate}</div>
        </div>
    )
};

export default CurrentTime;
