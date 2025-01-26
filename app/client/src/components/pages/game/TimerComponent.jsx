import React, { useEffect, useState } from "react";

const TimerComponent = ({ initialTime, handleTimer, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        handleTimer(newTime);
        if (newTime === 0) {
          setTimeLeft(initialTime);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, initialTime, handleTimer, isPaused]);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    const percentageLeft = (timeLeft / initialTime) * 100;

    if (percentageLeft > 50 || initialTime === 0) {
      return "green";
    } else if (percentageLeft > 15) {
      return "yellow";
    } else {
      return "red";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* progress bar */}
      <div
        style={{
          width: "100%",
          height: "7px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          marginBottom: "10px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(timeLeft / initialTime) * 100}%`,
            backgroundColor: getTimeColor(),
            transition: "width 1s linear",
          }}
        />
      </div>

      {/* text */}
      <div
        style={{
          position: "absolute", 
          marginTop: "20px",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "2.2rem",
          color: "white",
          textShadow: `-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black, 0px 0px 6px black`,
          zIndex: 2,
        }}
      >
        {initialTime === 0 ? (
          <span>∞ ∞ ∞</span>
        ) : (
          <span>{formatTime(timeLeft)}</span>
        )}
      </div>
    </div>
  );
};

export default TimerComponent;
