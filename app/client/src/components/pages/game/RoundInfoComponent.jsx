import React from "react";

const RoundInfoComponent = ({ mapName, roundNumber, maxRounds, currentPoints }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        padding: "10px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        opacity: 0.9,
      }}
    >
      {/* Map Name Rectangle */}
      <div
        title="Map Name"
        style={{
          background: "#f0f0f0",
          padding: "8px 16px",
          marginRight: "8px",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "normal",
            color: "#333",
          }}
        >
          {mapName}
        </p>
      </div>

      {/* Round Counter Rectangle */}
      <div
        title="Round Counter"
        style={{
          background: "#f0f0f0",
          padding: "8px 16px",
          marginRight: "8px",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "normal",
            color: "#333",
          }}
        >
          {roundNumber}/{maxRounds}
        </p>
      </div>

      {/* Points Rectangle */}
      <div
        title="Current Points"
        style={{
          background: "#f0f0f0",
          padding: "8px 16px",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "normal",
            color: "#333",
          }}
        >
          {currentPoints}
        </p>
      </div>
    </div>
  );
};

export default RoundInfoComponent;
