import React, { useEffect } from "react";

const StreetViewComponent = ({ location, apiKey }) => {
  useEffect(() => {
    if (!location) return;

    const initMap = () => {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
          position: location,
          pov: { heading: 34, pitch: 10 },
          visible: true,
          disableDefaultUI: false,
          addressControl: false,
          showRoadLabels: false
        }
      );
      console.log(
        `Displayed location: Latitude ${location.lat}, Longitude ${location.lng}`
      );
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initMap; 
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [location, apiKey]);

  return <div id="street-view" style={{ height: "100vh", width: "100%" }}></div>;
};

export default StreetViewComponent;
