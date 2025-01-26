import React, { useEffect, useState } from "react";

const TimerComponent = ({ initialTime, handleTimer, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        handleTimer(newTime); // Przekazuj nowy czas do rodzica
        if(newTime === 0){
            setTimeLeft(initialTime);
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval); // Czyszczenie interwału przy unmount
  }, [timeLeft, initialTime, handleTimer, isPaused]);

  useEffect(() => {
    setTimeLeft(initialTime); // Resetowanie czasu przy zmianie initialTime
  }, [initialTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div style={{ fontSize: "2rem", textAlign: "center" }}>
      {initialTime === 0 ? (
        <span>NO LIMIT</span>
      ) : (
        <span>Time left: {formatTime(timeLeft)}</span>
      )}
    </div>
  );
};

export default TimerComponent;
