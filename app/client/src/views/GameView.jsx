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
import TimerComponent from "../components/pages/game/TimerComponent";
import BlockComponent from "../components/pages/game/BlockComponent";
import RoundInfoComponent from "../components/pages/game/RoundInfoComponent";

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
  const [timeUp, setTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(state?.roundTime);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState('Move');
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
    if (location !== null) {
      const distance = calculateDistance(location, currentLocation);
      setDistance(Math.round(distance));
      const e = 2.718281828459045;
      const points = Math.max(0, Math.round(5000 * e ** (-10 * distance / 14916.862)));
      setScore(points);
      setPlayerLocation(location);
    } else {
      setScore(0);
      setDistance(0);
    }
    setActuallLocation(currentLocation);
  };

  const handleGuess = () => {
    addRoundInfo(playerLocation, actuallLocation, score);
    setShowSummary(true);
    setIsPaused(true);
  };

  const handleTimer = (timeLeft) => {
    setActuallLocation(locations[currentLocationIndex]);
    const time = state?.roundTime;
    if (timeLeft <= 0 && time != 0){
      if (playerLocation === null){
        addRoundInfo(playerLocation, actuallLocation, score);
        setShowSummary(true);
        setTimeUp(true);
        setTimeLeft(time);
        setIsPaused(true);
      }
      else {
        handleGuess();
      }
    }
    else {
      setTimeUp(false);
    }
  }

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
      setIsPaused(false);
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

    const handleMode = () => {
      const selectedMode = state?.selectedMode;
      setMode(selectedMode || "Move");
    }
    handleMode();
  }, [state, setLocations]);

  const currentLocation = locations[currentLocationIndex];

  return (
    <div style={{ position: "relative", height: "100%" }}>
        {!showSummary && (
            <BlockComponent mode={state?.selectedMode}></BlockComponent>
          )
        }
        {!showSummary && (
          <div style={{position: "absolute", left: "50%", transform: "translateX(-50%)", zIndex: 20, width: "100%"}}>
          <TimerComponent
            initialTime={timeLeft}
            isPaused={isPaused}
            handleTimer={handleTimer}
          />
        </div>
        )}
      <div
        style={{position: "absolute", top: "10px", left: "10px", zIndex: 10,}}>
        <NerdzikComponent height="100px" />
      </div>
      {/* conditional rendering for Street View and Map */}
      {!showSummary && !timeUp && (
        <>
          <StreetViewComponent location={currentLocation} apiKey={apiKey} mode={mode}/>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            handleGuess={handleGuess}
          />
          <div style={{ top: "10%", position: "absolute", width: "8%", right: 0 }}>
            <RoundInfoComponent 
              roundNumber={currentLocationIndex + 1} 
              maxRounds={locations.length} 
              currentPoints={roundInfo.reduce((total, round) => total + (round.points || 0), 0)} // suma punktów z dotychczasowych rund
            />
          </div>
        </>
      )}
 
      {/* display summaries */}
      {(showSummary || timeUp) && !showSummaryEnd && (
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
