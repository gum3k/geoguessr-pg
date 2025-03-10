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
import { useParams } from "react-router-dom";
import io from 'socket.io-client';


const socket = io('http://localhost:5000');

const GameView = () => {
  const { state } = useLocation();
  const { lobbyId } = useParams();
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
  const [gameSettings, setGameSettings] = useState({});
  const [roundInfo, setRoundInfo] = useState([]);

  const fetchDistanceFromServer = async (loc1, loc2) => {
    try {
        const response = await fetch('http://localhost:5000/api/calculate-distance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location1: loc1, location2: loc2 })
        });

        const data = await response.json();
        return data.distance; // Zwraca dystans obliczony na backendzie
    } catch (error) {
        console.error('Błąd pobierania dystansu z backendu:', error);
        return null;
    }
};


  const addRoundInfo = (pLocation, tLocation, npoints) => {
    const newRoundInfo = {playerLocation: pLocation, targetLocation: tLocation, points: npoints};
    setRoundInfo((prevRoundInfo) => [...prevRoundInfo, newRoundInfo]);
  }

  const handleLocationSelect = async (location) => {
    const currentLocation = locations[currentLocationIndex];
    if (location !== null) {
        const distance = await fetchDistanceFromServer(location, currentLocation); // Pobranie dystansu z backendu
        setDistance(Math.round(distance));

        const e = 2.718281828459045;
        const points = Math.max(0, Math.round(5000 * e ** (-10 * distance / 20037.852)));
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
    if (lobbyId) {
      state.seed = lobbyId;
      socket.emit("getLobbyData", lobbyId);
      socket.on("lobbyData", (data) => {
        console.log("Received lobby data:", data);
        setGameSettings(data);
        setLocations(data.locations || []);
        state.roundTime = data.roundTime;
      });

      socket.on("lobbyNotFound", () => {
        console.error("Lobby not found");
        navigate("/");
      });

      return () => {
        socket.off("lobbyData");
        socket.off("lobbyNotFound");
      };
    }
  }, [lobbyId, navigate]);

  useEffect(() => {
    if (locations.length === 0 && !lobbyId) {
      console.log("Loading NEW locations...");
      const loadLocations = async () => {
        const rounds = state?.rounds || 5; // default value is 5
        const newLocations = await fetchLocations(rounds, state?.mapName, state?.seed);
        setLocations(newLocations);
      };
      loadLocations();
    }
    const handleMode = () => {
      const selectedMode = state?.selectedMode;
      setMode(selectedMode || "Move");
    }
    handleMode();
  }, []);

  useEffect(() => {
    if (state?.roundTime) {
      setTimeLeft(state.roundTime);
    }
    else {
      setTimeLeft(0);
    }
  }, [state?.roundTime]);

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
        <NerdzikComponent height="60px" />
      </div>
      {!showSummary && !timeUp && apiKey && (
        <>
          <StreetViewComponent location={currentLocation} apiKey={apiKey} mode={mode} seed={state.seed}/>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            handleGuess={handleGuess}
          />
          <div style={{ top: "10%", position: "absolute", width: "8%", right: 0 }}>
            <RoundInfoComponent
              mapName={state?.mapName}
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
