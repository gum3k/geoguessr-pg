import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import useApiKey from "../../../hooks/useApiKey";

const containerStyle = {
  transition: "width 0.3s ease, height 0.3s ease",
  position: "absolute",
  bottom: "30px",
  right: "10px",
  zIndex: 10,
  cursor: "pointer",
};

const buttonStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  zIndex: 20,
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "opacity 0.3s ease",
};

const center = {
  lat: 0,
  lng: 0,
};

const MapComponent = ({ onLocationSelect, handleGuess }) => {
  const [apiKey] = useApiKey();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isMapHovered, setIsMapHovered] = useState(false);

  const mapContainerStyles = {
    ...containerStyle,
    width: isMapHovered || isButtonHovered ? "700px" : "300px", // Zmiana w zależności od stanu hover
    height: isMapHovered || isButtonHovered ? "500px" : "216px", // Zmiana w zależności od stanu hover
    opacity: isMapHovered || isButtonHovered ? 1 : 0.8, // Zmiana w zależności od stanu hover
  };

  useEffect(() => {
    if (!apiKey) return;

    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = () => {
          setIsLoaded(true);
        };
      } else {
        setIsLoaded(true);
      }
    };

    loadGoogleMapsScript();

    return () => {
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

  if (!isLoaded) return <p>Loading map ...</p>;

  return (
    <div>
      {/* Kontener dla mapy */}
      <div
        className="map-container"
        style={mapContainerStyles}
        onMouseEnter={() => setIsMapHovered(true)}
        onMouseLeave={() => setIsMapHovered(false)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyles}
          center={center}
          zoom={2}
          onClick={handleMapClick}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
      </div>

      {/* Przycisk New Location pojawia się tylko po najechaniu na mapę */}
      {isMapHovered || isButtonHovered ? (
        <button
          style={buttonStyle}
          onClick={handleGuess} // Wywołanie przekazanej funkcji
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Guess Location
        </button>
      ) : null}
    </div>
  );
};

export default MapComponent;
