import React from 'react';

const RoundButtonComponent = ({ onClick, buttonText }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "15px 30px",
        backgroundColor: "#0055ff",
        color: "white",
        fontSize: "24px",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 3,
        transition: "background-color 0.3s, transform 0.2s",
        marginRight: "5%"
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = "#003d99"} // hover effect
      onMouseLeave={(e) => e.target.style.backgroundColor = "#0055ff"} // reset hover
      onMouseDown={(e) => e.target.style.transform = "scale(0.95)"} // button press effect
      onMouseUp={(e) => e.target.style.transform = "scale(1)"}
    >
      {buttonText}
    </button>
  );
};

export default RoundButtonComponent;
