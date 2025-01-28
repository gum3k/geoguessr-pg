import React, { useEffect } from "react";

const StreetViewComponent = ({ location, apiKey, mode }) => {


  useEffect(() => {
    if (!location) return;

    const panoramaOptions = {
      position: location,
      pov: { heading: 34, pitch: 10 },
      visible: true,
      addressControl: false,
      showRoadLabels: false
    };

    if (mode == 'No Move') {
      panoramaOptions.clickToGo = false;
      panoramaOptions.disableDefaultUI = true;
    } 
    else if (mode == 'NMPZ') {
      panoramaOptions.disableDefaultUI = true;
      panoramaOptions.clickToGo = false;
      panoramaOptions.scrollwheel = false;
      panoramaOptions.panControl = false;
      panoramaOptions.zoomControl = false;
    } 
    else {
      panoramaOptions.clickToGo = true;
      panoramaOptions.scrollwheel = true;
    }
    const initMap = () => {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        panoramaOptions
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

  return (
      <div id="street-view" style={{ height: "100vh", width: "100%", zIndex: 1 }}></div>
  );

};

export default StreetViewComponent;
