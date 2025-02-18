import React from "react";

const RoundInfoComponent = ({ roundNumber, maxRounds, currentPoints }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        background: "linear-gradient(to right, #00aaff, #0055ff)",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        borderRadius: "0 0 10px 10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        opacity: 0.9
      }}
    >
      {/* current and max round */}
      <p
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Round {roundNumber}/{maxRounds}
      </p>

      {/* points */}
      <p
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        {currentPoints} Points
      </p>
    </div>
  );
};

export default RoundInfoComponent;