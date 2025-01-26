import React, { useEffect } from "react";

const BlockComponent = ({ mode }) => {

  const blockStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: "0%",
    zIndex: 10
  }

    if (mode == 'NMPZ') {
    return (
        <div style={blockStyle}>
            (<div id="cwelownia" style={blockStyle}></div>)
        </div>
        );
    }
}

export default BlockComponent;