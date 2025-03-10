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

  const addRoundInfo = (pLocation, tLocation, npoints) => {
    const newRoundInfo = {playerLocation: pLocation, targetLocation: tLocation, points: npoints};
    setRoundInfo((prevRoundInfo) => [...prevRoundInfo, newRoundInfo]);
  }

  const submitGuessToServer = async (location) => {
    if (!location) {
        setScore(0);
        setDistance(0);
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/game/submit-guess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lobbyId: lobbyId || "singleplayer",
                playerLocation: location,
                targetLocation: locations[currentLocationIndex]
            })
        });

        const data = await response.json();
        setDistance(data.distance ?? 0);
        setScore(data.score ?? 0);
        setPlayerLocation(location);
    } catch (error) {
        console.error('Błąd podczas wysyłania zgadywania:', error);
    }
  };

  const handleLocationSelect = async (location) => {
      setActuallLocation(locations[currentLocationIndex]);
      await submitGuessToServer(location);
  };

  const handleGuess = () => {
    addRoundInfo(playerLocation, actuallLocation, score);
    setShowSummary(true);
    setIsPaused(true);
  };

  const pauseTimer = () => {
    socket.emit("pauseTimer", lobbyId);
    setIsPaused(true);
};

const resumeTimer = () => {
    socket.emit("resumeTimer", lobbyId);
    setIsPaused(false);
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

  const handleGameSummary = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/game/round-info/${lobbyId || "singleplayer"}`);
        const data = await response.json();
        setRoundInfo(data);
        setShowSummaryEnd(true);
    } catch (error) {
        console.error('Błąd pobierania historii rund:', error);
    }
  };

  useEffect(() => {
    if (lobbyId) {
        socket.emit("getLobbyData", lobbyId);
        socket.on("lobbyData", (data) => {
            console.log("Received lobby data:", data);
            setGameSettings(data);
            setLocations(data.locations || []);
            state.roundTime = data.roundTime;

            // Startowanie timera w backendzie
            socket.emit("startRoundTimer", { lobbyId, roundTime: data.roundTime });
        });

        // Nasłuchiwanie na czas od backendu
        socket.on("timerUpdate", ({ timeLeft }) => {
            setTimeLeft(timeLeft);
        });

        socket.on("timerEnded", () => {
            setTimeUp(true);
            setIsPaused(true);
            handleGuess();
        });

        return () => {
            socket.off("lobbyData");
            socket.off("timerUpdate");
            socket.off("timerEnded");
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
