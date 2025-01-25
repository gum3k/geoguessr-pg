import React, { useEffect, useState } from "react";
import useApiKey from "../hooks/useApiKey";
import useLocations from "../hooks/useLocations";
import { fetchLocations } from "../utils/fetchLocations";
import { useNavigate } from "react-router-dom";
import MapComponent from "../pages/game/MapComponent";
import StreetViewComponent from "../pages/game/StreetViewComponent";
import GuessSummary from "../pages/game/GuessSummary";

const GameView = () => {
  const [apiKey] = useApiKey(); // Hook do pobierania klucza API
  const [locations, setLocations] = useLocations(); // Hook do zarządzania lokalizacjami
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0); // Śledzenie aktualnej lokalizacji
  const [playerLocation, setPlayerLocation] = useState(null); // Lokalizacja gracza
  const [actuallLocation, setActuallLocation] = useState(null);
  const [score, setScore] = useState(null); // Wynik gracza
  const [distance, setDistance] = useState(null); // Odległość między lokalizacjami
  const [showSummary, setShowSummary] = useState(false); // Czy wyświetlać podsumowanie
  const navigate = useNavigate(); // Hook do nawigacji

  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Promień Ziemi w kilometrach
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Odległość w kilometrach
  };

  const handleLocationSelect = (location) => {
    const currentLocation = locations[currentLocationIndex];
    const distance = calculateDistance(location, currentLocation);
    setDistance(Math.round(distance));
    const points = Math.max(0, Math.round(5000 - distance));
    setScore(points);
    setPlayerLocation(location);
    setActuallLocation(currentLocation);
    console.log("Player Location: ", playerLocation);
    console.log("Actuall Location: ", actuallLocation);
    };


    const handleGuess = async () => {
      if (currentLocationIndex >= locations.length - 1) {
        navigate("/"); // PODSUMOWANIE GRY
      } else {
        setShowSummary(true);
    }
  };
  const handleRandomLocation = async () => {
    if (currentLocationIndex >= locations.length - 1) {
      navigate("/"); // Przejście na ekran podsumowania gry
    } else {
      setShowSummary(true); // Pokaż podsumowanie po dokonaniu wyboru
      setCurrentLocationIndex((prevIndex) => prevIndex + 1); // Przechodzi do następnej lokalizacji
      setScore(null); // Resetuje wynik
      setPlayerLocation(null); // Resetuje lokalizację gracza
      setDistance(null); // Resetuje odległość
      setShowSummary(false); // Ukryj podsumowanie*/
    }
  };

  useEffect(() => {
    const loadLocations = async () => {
      const newLocations = await fetchLocations();
      setLocations(newLocations);
    };
    loadLocations();
  }, []);

  const currentLocation = locations[currentLocationIndex];

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      {/* Warunkowe wyświetlanie Street View i Mapy */}
      {!showSummary && (
        <>
          <StreetViewComponent location={currentLocation} apiKey={apiKey} />
          <MapComponent
            onLocationSelect={handleLocationSelect}
            handleGuess={handleGuess}
          />
        </>
      )}

      {/* Wyświetlanie GuessSummary */}
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
