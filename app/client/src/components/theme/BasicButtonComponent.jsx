import React from 'react';

const BasicButtonComponent = ({ onClick, buttonText }) => {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: "10px",
        padding: "20px 30px",
        backgroundColor: "#071385",
        color: "white",
        fontFamily: 'Accuratist, sans-serif',
        fontSize: "32px",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 3,
        backgroundImage: 'linear-gradient(to left, transparent, transparent 50%,rgb(0, 78, 167) 50%,rgb(21, 180, 0))',
        backgroundSize: '200% 100%',
        backgroundPosition: '100% 0',
        transition: 'all .25s ease-in',
      }}
      onMouseEnter={(e) => e.target.style.backgroundPosition = "0"} // hover effect
      onMouseLeave={(e) => e.target.style.backgroundPosition = "100% 0"} // reset hover
      onMouseDown={(e) => e.target.style.transform = "scale(0.95)"} // button press effect
      onMouseUp={(e) => e.target.style.transform = "scale(1)"}
    >
      {buttonText}
    </button>
  );
};

export default BasicButtonComponent;
