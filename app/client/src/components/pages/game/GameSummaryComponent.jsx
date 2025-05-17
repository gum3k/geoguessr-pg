import React, { useRef, useCallback } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import ContainerComponent from "../../theme/ContainerComponent";
import RoundButtonComponent from "../../theme/RoundButtonComponent";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  overflow: "hidden",
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

const GameSummaryComponent = ({ roundInfo = [] }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const bottomBarRef = useRef(null);

  const mainMenu = () => {
    navigate("/");
  };

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;

      const bounds = new window.google.maps.LatLngBounds();
      roundInfo.forEach(({ playerLocation, targetLocation }) => {
        if (playerLocation) bounds.extend(playerLocation);
        if (targetLocation) bounds.extend(targetLocation);
      });

      if (!bounds.isEmpty()) {
        const barHeight = bottomBarRef.current?.clientHeight || 0;
        map.fitBounds(bounds, {
          top: 30,
          right: 30,
          left: 30,
          bottom: barHeight,
        });
      }
    },
    [roundInfo]
  );

  const totalPoints = roundInfo.reduce((acc, { points = 0 }) => acc + points, 0);

  return (
    <ContainerComponent>
      <div
        className="map-wrapper mt-4"
        style={{ position: "relative", height: "100vh", backgroundColor: "white", overflow: "hidden" }}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: 0, lng: 0 }}
          zoom={2}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {roundInfo.map((round, i) => (
            <React.Fragment key={i}>
              {round.playerLocation && (
                <Marker
                  position={round.playerLocation}
                  icon={{
                    url: process.env.PUBLIC_URL + "/usericon.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
              {round.targetLocation && (
                <Marker
                  position={round.targetLocation}
                  icon={{
                    url: process.env.PUBLIC_URL + "/locationicon.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                />
              )}
              {round.playerLocation && round.targetLocation && (
                <Polyline
                  path={[round.playerLocation, round.targetLocation]}
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0,
                    strokeWeight: 2,
                    icons: [
                      {
                        icon: {
                          path: "M 0,-1 0,1",
                          strokeOpacity: 0.8,
                          scale: 4,
                        },
                        offset: "0%",
                        repeat: "20px",
                      },
                    ],
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </GoogleMap>

        <div
          ref={bottomBarRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "linear-gradient(to right, #00aaff, #0055ff)",
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 2,
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              display: "flex",
              width: "100%",
              marginLeft: "37%",
            }}
          >
            <div style={{ textAlign: "center", marginRight: "20px" }}>
              <p style={{ margin: 0, fontSize: "28px" }}>Total Points Earned</p>
              <p style={{ margin: 0, fontSize: "32px" }}>{totalPoints}</p>
            </div>
          </div>
          <RoundButtonComponent onClick={mainMenu} buttonText="End" />
        </div>
      </div>
    </ContainerComponent>
  );
};

export default GameSummaryComponent;
