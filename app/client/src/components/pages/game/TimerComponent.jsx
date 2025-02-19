import React, { useEffect, useState, useRef } from "react";

const styles = {
  progressBar: {
    width: "100%",
    height: "7px",
    backgroundColor: "#ddd",
    borderRadius: "10px",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    marginBottom: "10px",
    zIndex: 1
  }
}

const TimerComponent = ({ initialTime, handleTimer, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [noLimit, setNoLimit] = useState(false);

  const start = useRef(Date.now());

  useEffect(() => {
    if (isPaused) return;

    if (initialTime === 0){
      setNoLimit(true);
    } else {
      setNoLimit(false);
    }
    
    const interval = setInterval(() => {
      setTimeLeft(() => {
        const elapsed = (Date.now() - start.current) / 1000; // Oblicz czas, który upłynął w sekundach
        const newTime = Math.max(initialTime - elapsed, 0); // Pozostały czas
    
        setTimeout(() => handleTimer(newTime), 0);
    
        if (newTime === 0) {
          clearInterval(interval); // Zatrzymaj interwał po zakończeniu czasu
          return initialTime; // Resetuj czas do początkowej wartości
        }
    
        return newTime; // Aktualizuj pozostały czas
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, initialTime, handleTimer, isPaused]);


  useEffect(() => {
    setTimeLeft(initialTime);
    start.current = Date.now();
  }, [initialTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    const percentageLeft = (timeLeft / initialTime) * 100;

    if (percentageLeft > 40 || initialTime === 0) {
      return "green";
    } else if (percentageLeft > 10) {
      return "yellow";
    } else {
      return "red";
    }
  };

  return (
    initialTime != 0 && (
    <div style={{ position: "relative" }}>
      {!noLimit && (
      <div style={styles.progressBar}>
        <div
          style={{
            height: "100%",
            width: `${(timeLeft) / (initialTime) * 100}%`,
            backgroundColor: getTimeColor(),
            transition: "width 0.1s linear",
          }}
        />
      </div>
      )}
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
        
          <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
    )
  );
};

export default TimerComponent;
