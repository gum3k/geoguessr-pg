import React from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
  overflow: "hidden",
};

const GuessSummary = ({ playerLocation, targetLocation, points, distance, handleRandomLocation }) => {
  return (
    <div className="guess-summary">
      <h2 className="text-xl font-bold mb-4">Guess Summary</h2>
      <p className="mb-2">Points Earned: <span className="font-semibold">{points}</span></p>
      <p className="mb-2">Distance Difference: <span className="font-semibold">{distance.toFixed(2)} km</span></p>

      <div className="map-wrapper mt-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{
            lat: (playerLocation.lat + targetLocation.lat) / 2,
            lng: (playerLocation.lng + targetLocation.lng) / 2,
          }}
          zoom={2}
        >
          {/* Marker for the guess location */}
          <Marker position={playerLocation} label="Your Guess" />

          {/* Marker for the actual location */}
          <Marker position={targetLocation} label="Actual Location" />

          {/* Line between guess and actual location */}
          <Polyline
            path={[playerLocation, targetLocation]}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        </GoogleMap>
      </div>
      <button onClick={handleRandomLocation}>
        Next Round
      </button>

    </div>
  );
};

export default GuessSummary;
