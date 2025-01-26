import React, { useState, useEffect } from "react";

const TimerComponent = ({ initialTime, handleTimer }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (initialTime === 0) {
      handleTimer(null); // NO LIMIT, brak potrzeby odliczania
      return;
    }

    if (timeLeft <= 0) {
      handleTimer(0); // Czas się skończył
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, initialTime, handleTimer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {initialTime === 0 ? (
            <span>NO LIMIT</span>
        ) : ( <span>Time left: {formatTime(timeLeft)}</span> )
        }
    </div>
  );
};

export default TimerComponent;
