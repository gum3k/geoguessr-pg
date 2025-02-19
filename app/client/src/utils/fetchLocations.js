export const fetchLocations = async (count = 5, mapName = '') => {
  try {
    const response = await fetch(`/api/locations/random?count=${count}&mapName=${encodeURIComponent(mapName)}`);
    const locations = await response.json();
    return locations;
  } catch (err) {
    console.error('Error fetching locations:', err);
    return [];
  }
  };
  