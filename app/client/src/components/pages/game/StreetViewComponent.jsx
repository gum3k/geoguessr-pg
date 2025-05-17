import React, { useEffect } from "react";

const StreetViewComponent = ({ location, apiKey, mode }) => {

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Disable interaction with report/shortcuts without hiding attribution */
      #street-view .gm-style-cc, 
      #street-view .gmnoprint, 
      #street-view a[title="Report a problem"], 
      #street-view .gm-bundled-control {
        pointer-events: none !important;
        cursor: default !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
    }, []);

  useEffect(() => {
    if (!location) return;
    
    const panoramaOptions = {
      position: location,
      pov: { heading: location.pov.heading * 360, pitch: location.pov.pitch, zoom: location.pov.zoom },
      visible: true,
      addressControl: false,
      showRoadLabels: false,
      disableDefaultUI: mode === "NMPZ" || mode === "No Move",
      clickToGo: mode !== "No Move" && mode !== "NMPZ",
      scrollwheel: mode !== "NMPZ",
      panControl: true,
      disableDefaultUI: true,
      linksControl: false,
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
          if (streetViewContainer) {
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
          }
        });
      }
    };

    const loadGoogleMapsScript = () => {
      if (!window.google || !window.google.maps) {
        window.initMap = initMap;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places&v=weekly`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    loadGoogleMapsScript();
  }, [location, apiKey, mode]);

  return (
    <div id="street-view" style={{ height: "100vh", width: "100%", zIndex: 1 }}></div>
  );
};

export default StreetViewComponent;
