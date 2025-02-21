import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavigationComponent from "../components/theme/NavigationComponent";
import ContainerComponent from "../components/theme/ContainerComponent";
import MovingImageComponent from "../components/theme/MovingImageComponent";
import ContentComponent from "../components/theme/ContentComponent";
import BasicButtonComponent from "../components/theme/BasicButtonComponent";
import { socket } from "../socket";

const MultiplayerLobby = () => {
  const { lobbyCode } = useParams(); // Get lobby code from URL
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();

    if (lobbyCode) {
      // Join an existing lobby
      socket.emit("joinLobby", { lobbyCode });
    } else {
      // Create a new lobby
      socket.emit("createLobby", (newLobbyCode) => {
        navigate(`/lobby/${newLobbyCode}`); // Redirect to new lobby
        setIsHost(true);
      });
    }

    // Update player list
    socket.on("updatePlayers", (playerList) => {
      setPlayers(playerList);
    });

    // Assign host if this user created the lobby
    socket.on("assignHost", () => {
      setIsHost(true);
    });

    // Redirect when game starts
    socket.on("startGame", (gameData) => {
      navigate("/game", { state: gameData });
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("assignHost");
      socket.off("startGame");
    };
  }, [lobbyCode, navigate]);

  const startGame = () => {
    socket.emit("startGame", { lobbyCode });
  };

  return (
    <ContainerComponent>
      <NavigationComponent />
      <MovingImageComponent />
      <ContentComponent>
        <h2>Multiplayer Lobby</h2>
        <p>Lobby Code: <strong>{lobbyCode}</strong></p>
        <p>Share this link: <strong>{window.location.href}</strong></p>

        <ul style={styles.playerList}>
          {players.map((player, index) => (
            <li key={index} style={styles.playerItem}>{player.name}</li>
          ))}
        </ul>

        {isHost && players.length > 1 && (
          <BasicButtonComponent buttonText="Start Game" onClick={startGame} />
        )}
      </ContentComponent>
    </ContainerComponent>
  );
};

const styles = {
  playerList: {
    listStyle: "none",
    padding: 0,
    textAlign: "center",
  },
  playerItem: {
    padding: "10px",
    fontSize: "18px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: "10px",
    margin: "5px 0",
  },
};

export default MultiplayerLobby;
