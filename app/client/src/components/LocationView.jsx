import React, { useEffect, useState } from 'react';
import useApiKey from '../hooks/useApiKey';
import useLocations from '../hooks/useLocations';
import { fetchLocations } from '../utils/fetchLocations';
import { useNavigate } from 'react-router-dom';

const LocationView = () => {
  const [apiKey] = useApiKey(); // Custom hook to fetch API key
  const [locations, setLocations] = useLocations(); // Custom hook for managing locations
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0); // To track which location is being displayed
  const navigate = useNavigate(); // Hook to navigate between screens

  // Handle random location button click
  const handleRandomLocation = async () => {
    if (currentLocationIndex >= locations.length - 1) {
      // If all locations are displayed, go back to the starting screen
      navigate('/'); // Navigate to the starting screen
    } else {
      setCurrentLocationIndex((prevIndex) => prevIndex + 1); // Move to the next location
    }
  };

  useEffect(() => {
    const loadLocations = async () => {
      const newLocations = await fetchLocations();
      setLocations(newLocations);
    };
    loadLocations();
  }, []); // Fetch locations when the component mounts

  // Initialize Google Maps and Street View
  useEffect(() => {
    if (locations.length === 0 || currentLocationIndex >= locations.length) return; // If no locations or all locations are displayed

    const currentLocation = locations[currentLocationIndex];

    window.initMap = () => {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
          position: currentLocation,
          pov: { heading: 34, pitch: 10 },
          visible: true,
          addressControl: false,
        }
      );
      console.log(
        `Displayed location: Latitude ${currentLocation.lat}, Longitude ${currentLocation.lng}`
      );
    };

    // Load the Google Maps API if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      window.initMap(); // Call initMap immediately if the API is already loaded
    }
  }, [currentLocationIndex, locations, apiKey]);

  return (
    <div>
      <div id="street-view" style={{ height: '500px', width: '800px' }}></div>
      <button onClick={handleRandomLocation}>New Location</button>
    </div>
  );
};

export default LocationView;
