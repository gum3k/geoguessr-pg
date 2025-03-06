export const fetchLocations = async (count = 5, mapName = '', seed = crypto.getRandomValues(new Uint32Array(1))[0]) => {
  try {
    console.log('Fetching locations with seed:', seed);
    const response = await fetch(`/api/locations/random/${seed}?count=${count}&mapName=${encodeURIComponent(mapName)}`);
    const locations = await response.json();
    return locations;
  } catch (err) {
    console.error('Error fetching locations:', err);
    return [];
  }
  };
  