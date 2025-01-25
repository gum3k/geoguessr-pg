import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import useApiKey from "../hooks/useApiKey";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 0,
  lng: 0,
};

const MapComponent = ({ onLocationSelect }) => {
  const [apiKey] = useApiKey();
  const [isLoaded, setIsLoaded] = useState(false); // Stan do śledzenia, czy mapa jest załadowana
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (!apiKey) return; // Jeśli klucz API jeszcze nie jest dostępny, nic nie rób

    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
          setIsLoaded(true); // Zmieniamy stan na załadowany po załadowaniu skryptu
        };
      } else {
        setIsLoaded(true); // Jeśli Google Maps już jest załadowane, od razu ustawiamy stan na true
      }
    };

    loadGoogleMapsScript(); // Ładuj skrypt po zmianie apiKey

    return () => {
      // Czyścimy skrypt w przypadku zmiany komponentu (opcjonalnie)
      const scripts = document.querySelectorAll("script[src^='https://maps.googleapis.com/maps/api/js']");
      scripts.forEach((script) => script.remove());
    };
  }, [apiKey]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    onLocationSelect({ lat, lng });
  };

  if (!isLoaded) return <p>Loading map ...</p>; // Zwracamy komunikat o ładowaniu mapy

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={2}
      onClick={handleMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  );
};

export default MapComponent;
