import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import useApiKey from "../../../hooks/useApiKey";

const containerStyle = {
  transition: "width 0.3s ease, height 0.3s ease",
  position: "absolute",
  bottom: "30px",
  right: "30px",
  zIndex: 10,
  cursor: "pointer", // Default cursor style for the button
};

const buttonStyle = {
  position: "absolute",
  bottom: "15px",
  right: "61px",
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

  const mapRef = useRef(null);

  const mapContainerStyles = {
    ...containerStyle,
    width: isMapHovered || isButtonHovered ? "700px" : "300px",
    height: isMapHovered || isButtonHovered ? "500px" : "216px",
    opacity: isMapHovered || isButtonHovered ? 1 : 0.8,
  };

  const mapOptions = {
    minZoom: 2,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -180,
        east: 180,
      },
      strictBounds: true,
    },

    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
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

  // Handle mouse hover events for the map
  const handleMouseEnter = () => {
    setIsMapHovered(true);
    if (mapRef.current) {
      mapRef.current.style.cursor = "crosshair"; // Change cursor to crosshair using the map div
    }
  };

  const handleMouseLeave = () => {
    setIsMapHovered(false);
    if (mapRef.current) {
      mapRef.current.style.cursor = "default"; // Reset cursor
    }
  };

  const onMapLoad = (map) => {
    // Save the reference to the map after it loads
    mapRef.current = map.getDiv();
    map.addListener("mousemove", (mapsMouseEvent) => {
      map.setOptions({draggableCursor:'crosshair'});
    });
    mapRef.current.addEventListener("mouseenter", handleMouseEnter);
    mapRef.current.addEventListener("mouseleave", handleMouseLeave);
  };

  const onMapUnmount = () => {
    if (mapRef.current) {
      mapRef.current.removeEventListener("mouseenter", handleMouseEnter);
      mapRef.current.removeEventListener("mouseleave", handleMouseLeave);
    }
  };

  if (!isLoaded) return <p>Loading map ...</p>;

  return (
    <div>
      {/* Map container with hover effects */}
      <div
        className="map-container"
        style={mapContainerStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyles}
          center={center}
          zoom={2}
          onClick={handleMapClick}
          options={mapOptions}
          onLoad={onMapLoad} // Save the map reference after the map loads
          onUnmount={onMapUnmount}
        >
          {selectedLocation && <Marker position={selectedLocation} />}
        </GoogleMap>
      </div>

      {/* Button to guess location */}
      {isMapHovered || isButtonHovered ? (
        <button
          style={buttonStyle}
          onClick={handleGuess}
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
