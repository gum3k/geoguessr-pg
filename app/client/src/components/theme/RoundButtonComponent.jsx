import React from 'react';

const RoundButtonComponent = ({ onClick, buttonText }) => {
  return (
    <button
      onClick={onClick}
      style={styles.button}
      onMouseEnter={(e) => e.target.style.backgroundColor = "#003d99"}
      onMouseLeave={(e) => e.target.style.backgroundColor = "#0055ff"}
      onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
      onMouseUp={(e) => e.target.style.transform = "scale(1)"}
    >
      {buttonText}
    </button>
  );
};

const styles = {
  button: {
    padding: "15px 30px",
    backgroundColor: "#0055ff",
    color: "white",
    fontFamily: 'Accuratist, sans-serif',
    fontSize: "24px",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgb(255, 255, 255)",
    zIndex: 3,
    transition: "background-color 0.3s, transform 0.2s",
    marginRight: "5%"
  }
}

export default RoundButtonComponent;

