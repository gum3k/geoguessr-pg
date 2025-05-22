import React, { useEffect, useState } from "react";

const MapSelectionComponent = ({ onMapSelected }) => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await fetch("/api/locations/locations_sets");
        if (!response.ok) {
          throw new Error("Server error");
        }
        const data = await response.json();
        setMaps(data);
      } catch (err) {
        console.error("Error while loading available maps:", err);
        setError("Could not load the maps");
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []);

  const handleMapSelect = (map) => {
    setSelectedMap(map);
    if (onMapSelected) {
      onMapSelected(map);
    }
  };

  if (loading) return <p>Loading available maps...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Select a map</h2>
      <div style={styles.mapContainer}>
        {maps.map((map) => {
          const isSelected = selectedMap?.name === map.name;
          return (
            <div
              key={map.name}
              onClick={() => handleMapSelect(map)}
              style={{
                ...styles.map,
                border: isSelected ? "3px solid rgb(24, 150, 41)" : "1px solid rgb(14, 30, 80)",
                backgroundColor: isSelected ? "rgb(144, 18, 148)" : "rgb(74, 11, 90)",
              }}
            >
              {map.thumbnail ? (
                <img
                  src={map.thumbnail}
                  alt={`Thumbnail_${map.name}`}
                  style={styles.mapImageExists}
                />
              ) : (
                <div style={styles.mapImageNotExists} />
              )}
              <div style={{ marginTop: 8, fontWeight: isSelected ? "bold" : "normal" }}>
                {map.name}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMap && (
        <div style={{ marginTop: "1em" }}>
          <h3>Selected map: {selectedMap.name}</h3>
        </div>
      )}
    </div>
  );
};

const styles = {
  mapContainer:{
    display: "flex", 
    flexWrap: "wrap", 
    gap: "1em"
  },
  map: {
    cursor: "pointer",
    borderRadius: 8,
    padding: 10,
    textAlign: "center",
    width: 150
  },
  mapImageExists: {
    width: "8em",
    height: "5em", 
    borderRadius: 4 
  },
  mapImageNotExists: {
    width: "100%",
    height: 75, 
    backgroundColor: "#FFF", 
    borderRadius: 4
  }
}

export default MapSelectionComponent;