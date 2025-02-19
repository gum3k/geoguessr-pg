import React from "react";

const RoundInfoComponent = ({ mapName, roundNumber, maxRounds, currentPoints }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        padding: "15px",
        display: "flex",
        flexDirection: "row", // Changed to row for horizontal layout
        alignItems: "center", // Vertically center the items in the row
        justifyContent: "center", // Center the items horizontally
        zIndex: 2,
        opacity: 0.9,
      }}
    >
      {/* Map Name Rectangle */}
      <div
        style={{
          background: "linear-gradient(to right, #00aaff, #0055ff)",
          padding: "10px 20px",
          marginRight: "10px", // Space between the rectangles
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Map: {mapName}
        </p>
      </div>

      {/* Round Counter Rectangle */}
      <div
        style={{
          background: "linear-gradient(to right, #00aaff, #0055ff)",
          padding: "10px 20px",
          marginRight: "10px", // Space between the rectangles
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Round {roundNumber}/{maxRounds}
        </p>
      </div>

      {/* Points Rectangle */}
      <div
        style={{
          background: "linear-gradient(to right, #00aaff, #0055ff)",
          padding: "10px 20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {currentPoints} Points
        </p>
      </div>
    </div>
  );
};

export default RoundInfoComponent;
