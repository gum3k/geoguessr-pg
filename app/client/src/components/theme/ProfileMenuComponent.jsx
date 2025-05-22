import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import UsernameDisplayComponent from "./UsernameDisplayComponent";

const ProfileMenuComponent = () => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('Guest');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    if (token && token.username) {
      setUsername(token.username);
    } else {
      setUsername("Guest");
    }
  }, [token]);

  useEffect(() => {
    const textLength = username.length;
    const minSize = Math.max(36 - 1 * textLength, 12)
    const newFontSize = Math.min(minSize, 24);
    setFontSize(`${newFontSize}px`);
  }, [username]);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Successfully logged out');
        setToken(null);
        setUsername("Guest");
        navigate("/");
      } else { 
        const data = await res.json();
        throw new Error(data.message);
      }
    }
    catch (err){ 
      console.error('Error of logging out:', err);
      toast.error('Error of logging out:' + err);
    };
  };

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
           <img src="/usericon.png" alt="prof_pic" style={styles.profileImage}/>  {/*Tymczasowo, docelowe fetchowanie profilowego */} 
          <span style={styles.username}>
            <UsernameDisplayComponent onLoggedIn={setToken}/>
          </span>
        </Link>
        
        <div 
          style={{
            ...styles.dropdownMenu, 
            opacity: isMenuVisible ? 1 : 0,
            transform: isMenuVisible ? "translateY(0)" : "translateY(-30px)",
            pointerEvents: isMenuVisible ? "auto" : "none"
          }}
        >
         {token ? (
            <button
              onClick={handleLogout}
              style={styles.dropdownItem}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
              onMouseLeave={(e) => (e.target.style.textShadow = "none")}
            >
              LOGOUT
            </button>
          ) : (
            <>
              <Link
                to="/register"
                style={styles.dropdownItem}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => (e.target.style.textShadow = "none")}
              >
                REGISTER
              </Link>
              <Link
                to="/login"
                style={styles.dropdownItem}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                onMouseLeave={(e) => (e.target.style.textShadow = "none")}
              >
                LOGIN
              </Link>
            </>
          )}
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
    padding: "20px"
  },
  profileWrapper: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    textOverflow: "ellipsis",
    textAlign: "center"
  },
  profileImage: {
    width: "50px", 
    height: "50px",
    transform: "translate(-10px, 5px)"
  },
  username: {
  display: "block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: "20em",
  },
  button: {
    display: "flex",
    fontFamily: "Accuratist, sans-serif",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
    width: "200px",
    cursor: "pointer",
    padding: "0px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    transition: "all 0.3s",
    textTransform: 'uppercase',
    textAlign: 'center',
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
    width: "220px",
    zIndex: 1000,
    transition: "opacity 0.3s ease, transform 0.3s ease",
  },
  dropdownItem: {
    all: "unset",
    cursor: "pointer",
    fontFamily: "Accuratist, sans-serif",
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
    padding: "15px",
    textAlign: "center",
    alignItems: "center",
    transition: "all 0.3s",
    borderRadius: "5px",
    height: "1em"
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

export default ProfileMenuComponent;
