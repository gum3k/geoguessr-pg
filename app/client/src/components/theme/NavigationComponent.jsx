import React from "react";
import { Link } from "react-router-dom";
import NerdzikComponent from "./NerdzikComponent";
import ProfileComponent from "./ProfileComponent";
import UsernameDisplayComponent from "./UsernameDisplayComponent";

const NavigationComponent = () => {
  return (
    <div style={styles.navbar}>
      <NerdzikComponent />
      <ProfileComponent />
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "80px",
    padding: "0 20px",
    boxSizing: "border-box",
    zIndex: 1000,
  },
  button: {
    fontFamily: 'Accuratist, sans-serif',
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "white",
    cursor: "pointer",
    padding: "10px 20px",
    border: "none",
    background: "none",
    transition: "all 0.3s",
    textAlign: "center",
    marginLeft: "20px",
  },

};

export default NavigationComponent;
