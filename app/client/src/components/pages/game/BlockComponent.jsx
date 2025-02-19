import React, { useEffect } from "react";

const BlockComponent = ({ mode }) => {

  const blockStyle = {
    position: "absolute",
    width: "100%",
    height: "98.5%",
    opacity: "0%",
    zIndex: 2
  }

    if (mode == 'NMPZ') {
    return (
        <div style={blockStyle}>
            (<div style={blockStyle}></div>)
        </div>
        );
    }
}

export default BlockComponent;