import React, { useEffect } from "react";

const StreetViewComponent = ({ location, apiKey, mode }) => {


  useEffect(() => {
    if (!location) return;

    const panoramaOptions = {
      position: location,
      pov: { heading: Math.floor(Math.random() * 360), pitch: 0, zoom: 0 },
      visible: true,
      addressControl: false,
      showRoadLabels: false,
      disableDefaultUI: mode === "NMPZ" || mode === "No Move",
      clickToGo: mode !== "No Move" && mode !== "NMPZ",
      scrollwheel: mode !== "NMPZ",
      panControl: true,
      zoomControl: true,
      fullscreenControl: false,
    };

    const initMap = () => {
      const panorama = new window.google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        panoramaOptions
      );
      console.log(
      `Displayed location: Latitude ${location.lat}, Longitude ${location.lng}`
      );
      if (mode === "NMPZ" || mode === "No Move") {
        panorama.addListener('pano_changed', () => {
          const streetViewContainer = document.querySelector('#street-view');
          streetViewContainer.addEventListener(
            'keydown',
            (event) => {
            console.log(event.key);
            if (
              (
              event.key === 'ArrowUp' ||
              event.key === 'ArrowDown' ||
              event.key === 'w' ||
              event.key === 's'
              ) &&
              !event.metaKey &&
              !event.altKey &&
              !event.ctrlKey
            ) {
              event.stopPropagation();
            }
            },
            { capture: true }
          );
        });
      }
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
