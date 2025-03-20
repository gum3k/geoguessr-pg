import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UsernameDisplayComponent from "./UsernameDisplayComponent";

const ProfileComponent = () => {
    const username = UsernameDisplayComponent;
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [fontSize, setFontSize] = useState(null);

  useEffect(() => {
    const textLength = username.length;
    const newFontSize = Math.max(30 - (textLength), 12);
    setFontSize(`${newFontSize}px`);
  }, [username]);

  return (
    <div style={styles.container}>
      <div 
        style={styles.profileWrapper}
        onMouseEnter={() => setMenuVisible(true)}
        onMouseLeave={() => setMenuVisible(false)}
      >
        <Link to="/profile" style={{...styles.button, fontSize}}
        onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
        onMouseLeave={(e) => (e.target.style.textShadow = "none")}
        >
           <img src="/usericon.png" alt="prof_pic" style={styles.profileImage}></img>  {/*Tymczasowo, docelowe fetchowanie profilowego */} 
           <UsernameDisplayComponent/>

        </Link>
        
        <div 
          style={{
            ...styles.dropdownMenu, 
            opacity: isMenuVisible ? 1 : 0,
            transform: isMenuVisible ? "translateY(0)" : "translateY(-30px)",
            pointerEvents: isMenuVisible ? "auto" : "none"
          }}
        >
          <Link to="/register" 
            style={styles.dropdownItem}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseLeave={(e) => (e.target.style.textShadow = "none")}
          >
            REGISTER
          </Link>
          <Link to="/login"
            style={styles.dropdownItem}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
            onMouseLeave={(e) => (e.target.style.textShadow = "none")}
          >
            LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    width: "100%",
    padding: "60px"
  },
  profileWrapper: {
    position: "relative",
    display: "block",
    flexDirection: "column",
    alignItems: "center",
    textOverflow: 'ellipsis'
  },
  profileImage: {
    width: "50px", 
    height: "50px",
    transform: "translate(-10px, 5px)"
  },
  button: {
    display: "flex",
    fontFamily: "Accuratist, sans-serif",
    fontSize: "25px",
    fontWeight: "bold",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textDecoration: "none",
    color: "white",
    maxWidth: "130px",
    cursor: "pointer",
    padding: "0px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    transition: "all 0.3s",
    textTransform: 'uppercase',
    textAlign: 'left',
    backgroundOpacity: "70%",
    lineHeight: "60px"
  },
  dropdownMenu: {
    position: "absolute",
    top: "60px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    minWidth: "150px",
    zIndex: 1000,
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
  dropdownItem: {
    fontFamily: "Accuratist, sans-serif",
    fontSize: "18px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
    padding: "10px",
    textAlign: "center",
    transition: "all 0.3s",
    borderRadius: "5px",
  },
  buttonHover: {
    textShadow: `
      0 0 10px rgba(128, 0, 255, 1),   
      0 0 20px rgba(128, 0, 255, 1), 
      0 0 30px rgba(128, 0, 255, 1), 
      0 0 40px rgba(128, 0, 255, 1), 
      0 0 50px rgba(128, 0, 255, 0.9), 
      0 0 60px rgba(128, 0, 255, 0.8), 
      0 0 70px rgba(128, 0, 255, 0.7)  
    `,
  },
};

export default ProfileComponent;
