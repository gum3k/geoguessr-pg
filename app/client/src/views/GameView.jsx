import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
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
import socket from "../socket";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUserIdFromToken } from '../utils/getToken';

const GameView = () => {
  const { state } = useLocation();
  const { lobbyId } = useParams();
  const [apiKey] = useApiKey();
  const [locations, setLocations] = useLocations();
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [playerLocation, setPlayerLocation] = useState(null);
  const [actualLocation, setActualLocation] = useState(null);
  const [score, setScore] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showSummaryEnd, setShowSummaryEnd] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(state?.roundTime);
  const [isPaused, setIsPaused] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [mode, setMode] = useState('Move');
  const [, setGameSettings] = useState({});
  const [roundInfo, setRoundInfo] = useState([]);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [roundResults, setRoundResults] = useState(null);

  const addRoundInfo = useCallback((pLocation, tLocation, npoints) => {
    const newRoundInfo = {
      playerId: socket.id,
      playerName: `Player ${socket.id.substring(0, 5)}`,
      playerLocation: pLocation,
      targetLocation: tLocation,
      points: npoints
    };
    setRoundInfo((prevRoundInfo) => [...prevRoundInfo, newRoundInfo]);
  }, []);

  const submitGuessToServer = async (location) => {
    if (!location) {
      setScore(0);
      setDistance(0);
      return;
    }

    const userId = getUserIdFromToken();

    const roundNumber = currentLocationIndex + 1;

    try {
      const response = await fetch('http://localhost:5000/api/game/submit-guess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              lobbyId: lobbyId,
              playerLocation: location,
              targetLocation: locations[currentLocationIndex],
              userId: userId,
              roundNumber: roundNumber,
              gameId: state?.gameId
          })
      });

      const data = await response.json();
      setDistance(data.distance ?? 0);
      setScore(data.score ?? 0);
      setPlayerLocation(location);
      return data; 
    } catch (error) {
      console.error('Błąd podczas wysyłania zgadywania:', error);
    }
  };

  const handleLocationSelect = async (location) => {
    setActualLocation(locations[currentLocationIndex]);
    const result = await submitGuessToServer(location);
    if (result?.score != null) {
      handleGuess(location, result.score, result.distance); 
    } else {
    }
  };

  const handleGuess = useCallback((location, scoreValue, distanceValue) => {
    if (hasGuessed) return;
    setHasGuessed(true);

    if (lobbyId) {
      socket.emit("playerGuessed", {
        lobbyId,
        playerLocation: location,
        points: scoreValue,
        distance: distanceValue
      });
    } else {
      addRoundInfo(location, actualLocation, scoreValue);
      setShowSummary(true);
      setIsPaused(true);
    }
  }, [hasGuessed, actualLocation, lobbyId, addRoundInfo]);

    /*
  const pauseTimer = () => {
    socket.emit("pauseTimer", lobbyId);
    setIsPaused(true);
  };

  const resumeTimer = () => {
      socket.emit("resumeTimer", lobbyId);
      setIsPaused(false);
  };
  */

  const handleTimer = (timeLeft) => {
    setActualLocation(locations[currentLocationIndex]);
    const time = state?.roundTime;
    if (timeLeft <= 0 && time !== 0){
      if (playerLocation === null){
        addRoundInfo(playerLocation, actualLocation, score);
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
    const nextIndex = currentLocationIndex + 1;
    if (nextIndex >= locations.length) {
      setShowSummaryEnd(true);
      return;
    }

    setCurrentLocationIndex(nextIndex);
    setScore(null);
    setPlayerLocation(null);
    setDistance(null);
    setShowSummary(false);
    setIsPaused(false);
    setHasGuessed(false);
  };

  const handleGameSummary = async () => {
    if (lobbyId) {
      setShowSummaryEnd(true);
      return;
    }
    try {
      const resolvedLobbyId = lobbyId || state?.gameId;
      const response = await fetch(`http://localhost:5000/api/game/round-info/${resolvedLobbyId}`, {
      method: 'GET',
      credentials: 'include',
    });
      const data = await response.json();
      setRoundInfo(data);
      setShowSummaryEnd(true);
    } catch (error) {
      console.error('Błąd pobierania historii rund:', error);
    }
  };

  const handleGuessRef = useRef(handleGuess);
  useEffect(() => {
    handleGuessRef.current = handleGuess;
  }, [handleGuess]);

  useEffect(() => {
    if (!lobbyId) return;

    socket.emit("getLobbyData", lobbyId);
    
    const handleLobbyData = (data) => {
      setGameSettings(data);
      setLocations(data.locations || []);
      state.roundTime = data.roundTime;
      state.map = data.map;
      setIsHost(data.players[0].id === socket.id);
      socket.emit("startRoundTimer", { lobbyId, roundTime: data.roundTime });
    };

    const handleTimerUpdate = ({ timeLeft }) => {
      setTimeLeft(timeLeft);
    };

    const handleTimerEnded = () => {
      const time = state?.roundTime;
      if (time === 0 || showSummary) return; 

      setTimeUp(true);
      setIsPaused(true);

      if (lobbyId) {
        const guessed = !!playerLocation;

        if (!guessed) {
          setScore(0);
          setDistance(0);
          addRoundInfo(null, actualLocation, 0);
        }

        socket.emit("playerGuessed", {
          lobbyId,
          playerLocation: playerLocation ?? null,
          points: score ?? 0,
          distance: distance ?? 0
        });
      } else {
        // tryb singleplayer
        handleGuessRef.current();
      }
    };

    const handleRoundEnded = () => {
      console.log("ROUND ENDED")
      setIsPaused(true);
      setTimeUp(false);
      setTimeLeft(state.roundTime || 0);
      setHasGuessed(false);
    };

    const handleStartNext = ({ nextIndex, roundTime }) => {
      setCurrentLocationIndex(nextIndex); 
      setScore(null);
      setPlayerLocation(null);
      setDistance(null);
      setShowSummary(false);
      setIsPaused(false);
      setTimeLeft(roundTime);
      setHasGuessed(false);
      setRoundResults(null);
      socket.emit("startRoundTimer", { lobbyId, roundTime });
    };

    const handleGuessedNotification = ({ playerName, playerId }) => {
      if (playerId !== socket.id) {
        toast.info(`${playerName} has made a guess!`);
      }
    };

    const handleRoundResults = ({ targetLocation, guesses }) => {
      setRoundResults({ targetLocation, guesses });

      setRoundInfo(prev => {
        const newEntries = guesses.map(playerGuess => {
          const alreadyExists = prev.some(
            r =>
              r.playerId === playerGuess.playerId &&
              r.playerLocation?.lat === playerGuess.playerLocation?.lat &&
              r.playerLocation?.lng === playerGuess.playerLocation?.lng &&
              r.targetLocation?.lat === targetLocation?.lat &&
              r.targetLocation?.lng === targetLocation?.lng
          );
          if (alreadyExists) return null;
          setShowSummary(true);
          return {
            playerId: playerGuess.playerId,
            playerName: playerGuess.playerName, 
            playerLocation: playerGuess.playerLocation,
            targetLocation,
            points: playerGuess.points
          };
        }).filter(Boolean);

        return [...prev, ...newEntries];
      });
    };
      
    socket.on("playerGuessedNotification", handleGuessedNotification);
    socket.on("lobbyData",    handleLobbyData);
    socket.on("timerUpdate",  handleTimerUpdate);
    socket.on("timerEnded",   handleTimerEnded);
    socket.on("roundEnded",   handleRoundEnded);
    socket.on("startNextRound", handleStartNext);
    socket.on("roundResults", handleRoundResults);

    return () => {
      socket.off("playerGuessedNotification", handleGuessedNotification);
      socket.off("lobbyData",     handleLobbyData);
      socket.off("timerUpdate",   handleTimerUpdate);
      socket.off("timerEnded",    handleTimerEnded);
      socket.off("roundEnded",    handleRoundEnded);
      socket.off("startNextRound", handleStartNext);
      socket.off("roundResults", handleRoundResults);
    };
  }, [lobbyId]);

  useEffect(() => {
    if (locations.length === 0 && !lobbyId) {
      const loadLocations = async () => {
        const rounds = state?.rounds || 5;
        const newLocations = await fetchLocations(rounds, state?.map.directory);
        setLocations(newLocations);

        const gameId = state?.gameId;
        if (!gameId) {
          console.warn("Brak gameId – nie dodano rund do bazy");
          return;
        }

        newLocations.forEach(async (loc, index) => {
          try {
            await fetch('http://localhost:5000/api/game/add-round', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                gameId: gameId,
                roundNumber: index + 1,
                lat: loc.lat,
                lon: loc.lng
              })
            });
          } catch (error) {
            console.error("Błąd podczas dodawania rundy:", error);
          }
        });
      };

      loadLocations();
    }

    const handleMode = () => {
      const selectedMode = state?.selectedMode;
      setMode(selectedMode || "Move");
    };

    handleMode();
  }, [locations.length, lobbyId, state]);


  useEffect(() => {
    if (state?.roundTime) {
      setTimeLeft(state.roundTime);
    }
    else {
      setTimeLeft(0);
    }
  }, [state?.roundTime]);

  const currentLocation = locations[currentLocationIndex];

  useEffect(() => {
    setCurrentLocationIndex(0);
    setPlayerLocation(null);
    setActualLocation(null);
    setScore(null);
    setDistance(null);
    setShowSummary(false);
    setShowSummaryEnd(false);
    setTimeUp(false);
    setRoundInfo([]);
    setTimeLeft(state?.roundTime || 0);
  }, [lobbyId, state?.roundTime]);


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
          <StreetViewComponent location={currentLocation} apiKey={apiKey} mode={mode}/>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            handleGuess={handleGuess}
            disabled={hasGuessed}
            buttonLabel={hasGuessed ? "Waiting for others…" : "Guess Location"}
          />
          <div style={{ top: "10%", position: "absolute", width: "8%", right: 0 }}>
            <RoundInfoComponent
              mapName={state?.map.name}
              roundNumber={currentLocationIndex + 1} 
              maxRounds={locations.length} 
              currentPoints={roundInfo
                .filter(round => round.playerId === socket.id)
                .reduce((total, round) => total + (round.points || 0), 0)} 
            />
          </div>
        </>
      )}
 
      {/* display summaries */}
      {(showSummary || timeUp) && !showSummaryEnd && (
      <GuessSummary
        guesses={roundResults?.guesses || [{
          playerId: socket.id,
          playerName: 'You',
          playerLocation: playerLocation,
          points: score,
          distance: distance
        }]}
        targetLocation={roundResults?.targetLocation || actualLocation}
        handleRandomLocation={handleRandomLocation}
        isHost={isHost}
        ifLast={currentLocationIndex >= locations.length - 1}
        handleGameSummary={handleGameSummary}
        lobbyId={lobbyId}
        allRounds={roundInfo}
      />
      )}
      {showSummaryEnd && (
        <GameSummaryComponent
        roundInfo={roundInfo}
        guesses={roundResults?.guesses || []}
        lobbyId={lobbyId}
        />
      )}
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default GameView;
