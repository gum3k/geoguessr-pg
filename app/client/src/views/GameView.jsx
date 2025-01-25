import React, { useEffect, useState } from "react";
import useApiKey from "../hooks/useApiKey";
import useLocations from "../hooks/useLocations";
import { fetchLocations } from "../utils/fetchLocations";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import StreetViewComponent from "../components/StreetViewComponent";

const GameView = () => {
  const [apiKey] = useApiKey(); // Hook do pobierania klucza API
  const [locations, setLocations] = useLocations(); // Hook do zarządzania lokalizacjami
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0); // Śledzenie aktualnej lokalizacji
  const [playerLocation, setPlayerLocation] = useState(null); // Lokalizacja gracza
  const [score, setScore] = useState(null); // Wynik gracza
  const navigate = useNavigate(); // Hook do nawigacji

  // Obsługuje kliknięcie przycisku "Nowa lokalizacja"
  const handleRandomLocation = async () => {
    if (currentLocationIndex >= locations.length - 1) {
      navigate("/"); // Przechodzi do ekranu startowego, jeśli wszystkie lokalizacje zostały wyświetlone
    } else {
      setCurrentLocationIndex((prevIndex) => prevIndex + 1); // Przechodzi do następnej lokalizacji
      setScore(null); // Resetuje wynik
      setPlayerLocation(null); // Resetuje lokalizację gracza
    }
  };

  // Ładowanie lokalizacji, gdy komponent jest montowany
  useEffect(() => {
    const loadLocations = async () => {
      const newLocations = await fetchLocations();
      setLocations(newLocations);
    };
    loadLocations();
  }, []);

  // Funkcja obliczająca odległość między dwoma lokalizacjami
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

  // Obsługuje wybór lokalizacji przez gracza
  const handleLocationSelect = (location) => {
    setPlayerLocation(location);
    const currentLocation = locations[currentLocationIndex];
    const distance = calculateDistance(location, currentLocation);
    const points = Math.max(0, Math.round(5000 - distance)); // Logika punktów: max 5000 punktów, mniej za większą odległość
    setScore(points);
  };

  const currentLocation = locations[currentLocationIndex]; // Bieżąca lokalizacja

  return (
    <div>
      <h1>GeoGuessr</h1>

      {/* Wyświetlanie Street View */}
      <StreetViewComponent location={currentLocation} apiKey={apiKey} />

      {/* Mapa do wyboru lokalizacji przez gracza */}
      <h2>Select your location:</h2>
      <MapComponent onLocationSelect={handleLocationSelect} />

      {/* Wyświetlanie wyniku i odległości */}
      {score !== null && playerLocation && (
        <div>
          <p>
            You selected: Latitude {playerLocation.lat}, Longitude {playerLocation.lng}
          </p>
          <p>
            Distance from target:{" "}
            {Math.round(
              calculateDistance(playerLocation, locations[currentLocationIndex])
            )}{" "}
            km
          </p>
          <p>Your score: {score}</p>
        </div>
      )}

      <button onClick={handleRandomLocation}>New Location</button>
    </div>
  );
};

export default GameView;
