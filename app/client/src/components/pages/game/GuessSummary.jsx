import React from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import ContainerComponent from '../../theme/ContainerComponent';
import RoundButtonComponent from '../../theme/RoundButtonComponent';

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

const GuessSummary = ({ playerLocation, targetLocation, points, distance, handleRandomLocation, ifLast, handleGameSummary }) => {
  const center = playerLocation
  ? {
      lat: (playerLocation.lat + targetLocation.lat) / 2,
      lng: (playerLocation.lng + targetLocation.lng) / 2,
    }
  : targetLocation ?
  { lat: targetLocation.lat, lng: targetLocation.lng }
  : {lat: 0, lng: 0}
  
  return (
    <ContainerComponent>
      <div className="map-wrapper mt-4" style={{ position: "relative", height: "100vh", backgroundColor: "white" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={4}
          options={mapOptions}
        >
          {/* marker for the guess location */}
          {playerLocation && (
            <Marker
              position={playerLocation}
              icon={{
                url: "usericon.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {/* marker for the actual location */}
          {}
          <Marker
            position={targetLocation}
            icon={{
              url: "locationicon.png",
              scaledSize: new window.google.maps.Size(40, 40), 
            }}
          />

          {/* line between guess and actual location */}
          <Polyline
            path={[playerLocation, targetLocation]}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0,
              strokeWeight: 2,
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,1", 
                    strokeOpacity: 0.8,
                    scale: 4,
                  },
                  offset: "0%",
                  repeat: "20px", 
 
                }
              ],
            }}
          />
        </GoogleMap>
        
        {/* bottom bar */}
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
        {/* points and distance */}
        <div style={{ color: "white", fontSize: "24px", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", display: "flex", width: "100%", marginLeft: "37%" }}>
          <div style={{ textAlign: "center", marginRight: "20px" }}>
            <p style={{ margin: 0, fontSize: "28px" }}>Points Earned</p>
            <p style={{ margin: 0, fontSize: "32px" }}>{points !== null ? points : "0"}</p>
          </div>

          <div style={{ textAlign: "center", marginLeft: "20px" }}>
            <p style={{ margin: 0, fontSize: "28px" }}>Distance Difference</p>
            <p style={{ margin: 0, fontSize: "32px" }}>
               {distance !== null ? `${distance.toFixed(2)} km` : "- km"}
            </p>
          </div>
        </div>

        {!ifLast && (
          <RoundButtonComponent onClick={handleRandomLocation} buttonText="Next Round" />
        )}
        {ifLast && (
          <RoundButtonComponent onClick={handleGameSummary} buttonText="Game Summary" />
        )}

      </div>
    </div>
  </ContainerComponent>
  );
  

};

export default GuessSummary;
