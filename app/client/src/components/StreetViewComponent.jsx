import React, { useEffect } from "react";

const StreetViewComponent = ({ location, apiKey }) => {
  useEffect(() => {
    if (!location) return; // Nie wyświetlaj mapy, jeśli nie ma lokalizacji

    const initMap = () => {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
          position: location,
          pov: { heading: 34, pitch: 10 },
          visible: true,
          addressControl: false,
        }
      );
      console.log(
        `Displayed location: Latitude ${location.lat}, Longitude ${location.lng}`
      );
    };

    // Ładowanie API Google Maps, jeśli nie jest załadowane
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      initMap(); // Jeśli API już jest załadowane, od razu uruchom initMap
    }
  }, [location, apiKey]);

  return <div id="street-view" style={{ height: "500px", width: "800px" }}></div>;
};

export default StreetViewComponent;
