import React from 'react';

const BasicButtonComponent = ({ onClick, buttonText }) => {
  return (
    <button
      onClick={onClick}
      style={styles.button}
      onMouseEnter={(e) => e.target.style.backgroundPosition = "0"}
      onMouseLeave={(e) => e.target.style.backgroundPosition = "100% 0"}
      onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
      onMouseUp={(e) => e.target.style.transform = "scale(1)"}
    >
      {buttonText}
    </button>
  );
};

const styles = {
    button: {
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
      backgroundImage: 'linear-gradient(to left, transparent, transparent 30%,rgb(4, 81, 168) 70%,rgb(21, 180, 0))',
      backgroundSize: '200% 100%',
      backgroundPosition: '100% 0',
      border: '2px solid ',
      borderColor: 'rgb(21, 180, 0)',
      transition: 'all .25s ease-in'
    }
}

export default BasicButtonComponent;
