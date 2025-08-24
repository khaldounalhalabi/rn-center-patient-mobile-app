import dayjs from "dayjs";
import { useEffect, useState } from "react";

const useTimer = ({ startTime }: { startTime?: string }) => {
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    const start = startTime ? dayjs(startTime) : dayjs();

    const updateTimer = () => {
      const now = dayjs();
      const diff = dayjs.duration(now.diff(start));

      const formatted = [
        String(diff.days()).padStart(2, "0"),
        String(diff.hours()).padStart(2, "0"),
        String(diff.minutes()).padStart(2, "0"),
        String(diff.seconds()).padStart(2, "0"),
      ].join(":");

      setElapsedTime(formatted);
    };

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  return elapsedTime;
};

export default useTimer;
