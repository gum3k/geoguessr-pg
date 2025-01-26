import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useApiKey from "../hooks/useApiKey";
import useLocations from "../hooks/useLocations";
import { fetchLocations } from "../utils/fetchLocations";
import MapComponent from "../components/pages/game/MapComponent";
import StreetViewComponent from "../components/pages/game/StreetViewComponent";
import GuessSummary from "../components/pages/game/GuessSummary";
import GameSummaryComponent from "../components/pages/game/GameSummaryComponent";
import NerdzikComponent from "../components/theme/NerdzikComponent";

const GameView = () => {
  const { state } = useLocation();
  const [apiKey] = useApiKey();
  const [locations, setLocations] = useLocations();
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [playerLocation, setPlayerLocation] = useState(null);
  const [actuallLocation, setActuallLocation] = useState(null);
  const [score, setScore] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showSummaryEnd, setShowSummaryEnd] = useState(false);
  const navigate = useNavigate();
  

  const [roundInfo, setRoundInfo] = useState([]);

  const addRoundInfo = (pLocation, tLocation, npoints) => {
    const newRoundInfo = {playerLocation: pLocation, targetLocation: tLocation, points: npoints};
    setRoundInfo((prevRoundInfo) => [...prevRoundInfo, newRoundInfo]);
  }


  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // radius
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // final distance
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
    addRoundInfo(playerLocation, actuallLocation, score);
    setShowSummary(true);
  };

  const handleRandomLocation = () => {
    if (currentLocationIndex >= locations.length - 1) {
      navigate("/"); // redirecting to summary
    } else {
      setShowSummary(true);
      setCurrentLocationIndex((prevIndex) => prevIndex + 1);
      setScore(null);
      setPlayerLocation(null);
      setDistance(null);
      setShowSummary(false);
    }
  };

  const handleGameSummary = () => {
    setShowSummaryEnd(true);
  };

  useEffect(() => {
    const loadLocations = async () => {
      const rounds = state?.rounds || 5; // default value is 5
      const newLocations = await fetchLocations(rounds);
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
          opacity: 0.5,
          zIndex: 10,
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
      {showSummary && playerLocation && !showSummaryEnd && (
        <GuessSummary
          playerLocation={playerLocation}
          targetLocation={actuallLocation}
          points={score}
          distance={distance}
          handleRandomLocation={handleRandomLocation}
          ifLast={(currentLocationIndex >= locations.length - 1)}
          handleGameSummary={handleGameSummary}
        />
      )}
      {showSummaryEnd && (
        <GameSummaryComponent
        roundInfo={roundInfo}
      />
      )}
      
    </div>
  );
};

export default GameView;
