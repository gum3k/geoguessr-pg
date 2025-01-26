import React from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import ContainerComponent from '../../theme/ContainerComponent';
import RoundButtonComponent from './RoundButtonComponent';
import { useNavigate } from 'react-router-dom';

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  overflow: "hidden",
};

const mapOptions = {
  minZoom: 2,
  restriction: {
    latLngBounds: {
      north: 85, 
      south: -85, 
      west: -180, 
      east: 180 
    },
    strictBounds: true, 
  },
  streetViewControl: false, 
  mapTypeControl: false, 
  fullscreenControl: false, 
};


const GameSummaryComponent = ({ roundInfo }) => {
  const navigate = useNavigate();
  
  const mainMenu = () => {
    navigate('/');
  };

  const totalPoints = roundInfo.reduce((acc, round) => acc + round.points, 0);

  return (
    <ContainerComponent>
      <div className="map-wrapper mt-4" style={{ position: "relative", height: "100vh", backgroundColor: "white" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{
            lat: roundInfo[0]?.playerLocation.lat || 0,
            lng: roundInfo[0]?.playerLocation.lng || 0,
          }}
          zoom={4}
          options={mapOptions}
        >
          {/* Rysowanie markerów i linii dla wszystkich rund */}
          {roundInfo.map((round, index) => (
            <React.Fragment key={index}>
              <Marker
                position={round.playerLocation}
                icon={{
                  url: "usericon.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              <Marker
                position={round.targetLocation}
                icon={{
                  url: "locationicon.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
              <Polyline
                path={[round.playerLocation, round.targetLocation]}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            </React.Fragment>
          ))}
        </GoogleMap>

        {/* Bottom bar with gradient background */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "linear-gradient(to right, #00aaff, #0055ff)",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 2,
            borderRadius: "10px 10px 0 0", // rounded corners
          }}
        >
          {/* Points*/}
          <div style={{ color: "white", fontSize: "24px", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", display: "flex", width: "100%", marginLeft: "37%" }}>
            {/* Total Points Earned section */}
            <div style={{ textAlign: "center", marginRight: "20px" }}>
              <p style={{ margin: 0, fontSize: "28px" }}>Total Points Earned</p>
              <p style={{ margin: 0, fontSize: "32px" }}>{totalPoints}</p>
            </div>
          </div>
            <RoundButtonComponent onClick={mainMenu} buttonText="End" />
        </div>
      </div>
    </ContainerComponent>
  );
};

export default GameSummaryComponent;
