import React, { useRef, useCallback } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import ContainerComponent from '../../theme/ContainerComponent';
import RoundButtonComponent from '../../theme/RoundButtonComponent';
import socket from "../../../socket";
import LeaderboardTable from "./LeaderboardTable";

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
      east: 180
    },
    strictBounds: true,
  },
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

const GuessSummary = ({
  guesses = [], 
  targetLocation,
  handleRandomLocation,
  isHost,
  ifLast,
  handleGameSummary,
  lobbyId,
  allRounds = []
}) => {
  const mapRef = useRef(null);
  const bottomBarRef = useRef(null);

  const onMapLoad = useCallback(map => {
    mapRef.current = map;

    const bounds = new window.google.maps.LatLngBounds();

    guesses.forEach(g => {
      if (g.playerLocation) bounds.extend(g.playerLocation);
    });

    if (targetLocation) bounds.extend(targetLocation);

    if (!bounds.isEmpty()) {
      const barHeight = bottomBarRef.current?.clientHeight || 0;
      map.fitBounds(bounds, {
        top: 30,
        right: 30,
        left: 30,
        bottom: barHeight,
      });
    }
  }, [guesses, targetLocation]);

  return (
  <ContainerComponent>
    <div
      className="map-wrapper mt-4"
      style={{ position: "relative", height: "100vh", backgroundColor: "white", overflow: "hidden" }}
    >
      <LeaderboardTable guesses={guesses} allRounds={allRounds} lobbyId={lobbyId} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: 0, lng: 0 }}
        zoom={6}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {targetLocation && (
          <Marker
            position={targetLocation}
            icon={{
              url: process.env.PUBLIC_URL + "/locationicon.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}

        {guesses.map((g) => (
          <React.Fragment key={g.playerId}>
            <Marker
              position={g.playerLocation}
              label={{
                text: g.playerName,
                className: "guess-label"
              }}
              icon={{
                url: process.env.PUBLIC_URL + "/usericon.png",
                scaledSize: new window.google.maps.Size(40, 40),
                labelOrigin: new window.google.maps.Point(20, -10) 
              }}
            />
            <Polyline
              path={[g.playerLocation, targetLocation]}
              options={{
                strokeColor: g.playerId === socket.id ? "#FF0000" : "#000000",
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
          </React.Fragment>
        ))}
      </GoogleMap>

      {/* bottom bar */}
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
        <div style={{
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          display: "flex",
          width: "100%",
          marginLeft: "37%",
        }}>
          <div style={{ textAlign: "center", marginRight: "20px" }}>
            <p style={{ margin: 0, fontSize: "28px" }}>Points Earned</p>
            <p style={{ margin: 0, fontSize: "32px" }}>
              {guesses.find(g => g.playerId === socket.id)?.points ?? 0}
            </p>
          </div>
          <div style={{ textAlign: "center", marginLeft: "20px" }}>
            <p style={{ margin: 0, fontSize: "28px" }}>Your Distance</p>
            <p style={{ margin: 0, fontSize: "32px" }}>
              {(() => {
                const guess = guesses.find(g => g.playerId === socket.id);
                if (!guess?.distance) return "-";
                return `${guess.distance.toFixed(2)} km`;
              })()}
            </p>
          </div>
        </div>

        {!ifLast ? (
          !lobbyId || isHost ? (
            <RoundButtonComponent
              onClick={() => {
                if (lobbyId) {
                  socket.emit("nextRound", lobbyId);
                } else {
                  handleRandomLocation();
                }
              }}
              buttonText="Next Round"
            />
          ) : (
            <RoundButtonComponent disabled buttonText="Waiting for host…" />
          )
        ) : (
          <RoundButtonComponent onClick={handleGameSummary} buttonText="Game Summary" />
        )}
      </div>
    </div>
  </ContainerComponent>
  );
};

export default GuessSummary;
