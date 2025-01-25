import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApiKey from "../hooks/useApiKey";
import useLocations from "../hooks/useLocations";
import { fetchLocations } from "../utils/fetchLocations";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/pages/game/MapComponent";
import StreetViewComponent from "../components/pages/game/StreetViewComponent";
import GuessSummary from "../components/pages/game/GuessSummary";

const GameView = () => {
  const { state } = useLocation(); // Retrieve state from navigation (contains rounds)
  const [apiKey] = useApiKey(); // Hook to fetch the API key
  const [locations, setLocations] = useLocations(); // Hook for managing locations
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0); // Current location index
  const [playerLocation, setPlayerLocation] = useState(null); // Player's selected location
  const [actuallLocation, setActuallLocation] = useState(null); // Actual target location
  const [score, setScore] = useState(null); // Player's score
  const [distance, setDistance] = useState(null); // Distance between locations
  const [showSummary, setShowSummary] = useState(false); // Toggle summary visibility
  const navigate = useNavigate(); // Navigation hook
  

  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const handleLocationSelect = (location) => {
    const currentLocation = locations[currentLocationIndex];
    const distance = calculateDistance(location, currentLocation);
    setDistance(Math.round(distance));
    const e = 2.718281828459045;
    const points = Math.max(0, Math.round(5000 * e ** (-10 * distance / 14916.862)));
    setScore(points);
    setPlayerLocation(location);
    setActuallLocation(currentLocation);
  };

  const handleGuess = () => {
    if (currentLocationIndex >= locations.length - 1) {
      navigate("/"); // Redirect to summary screen
    } else {
      setShowSummary(true);
    }
  };

  const handleRandomLocation = () => {
    if (currentLocationIndex >= locations.length - 1) {
      navigate("/"); // Redirect to summary screen
    } else {
      setShowSummary(true);
      setCurrentLocationIndex((prevIndex) => prevIndex + 1);
      setScore(null);
      setPlayerLocation(null);
      setDistance(null);
      setShowSummary(false);
    }
  };

  useEffect(() => {
    const loadLocations = async () => {
      const rounds = state?.rounds || 5; // Default to 5 rounds if none provided
      const newLocations = await fetchLocations(rounds); // Fetch locations based on number of rounds
      setLocations(newLocations);
    };
    loadLocations();
  }, [state, setLocations]);

  const currentLocation = locations[currentLocationIndex];

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          opacity: 0.5, // Semi-transparent
          zIndex: 10, // Ensure it appears above other elements
        }}
      >
        <NerdzikComponent height="100px" />
      </div>
      {/* Conditional rendering for Street View and Map */}
      {!showSummary && (
        <>
          <StreetViewComponent location={currentLocation} apiKey={apiKey} />
          <MapComponent
            onLocationSelect={handleLocationSelect}
            handleGuess={handleGuess}
          />
        </>
      )}

      {/* Display GuessSummary */}
      {showSummary && playerLocation && (
        <GuessSummary
          playerLocation={playerLocation}
          targetLocation={actuallLocation}
          points={score}
          distance={distance}
          handleRandomLocation={handleRandomLocation}
        />
      )}
    </div>
  );
};

export default GameView;
