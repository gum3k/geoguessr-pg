let panorama;
let streetViewService;
const MAP_NAME = "equally_distributed_world_5mln";
const LOCATIONS_PATH = `../locations/locations_sets/${MAP_NAME}/locations.csv`;
let locations = [];

// Initialize Google Maps and fetch locations
function initMap() {
    streetViewService = new google.maps.StreetViewService();

    loadLocations()
        .then(() => {
            console.log("Locations loaded successfully.");
            console.log(`Total locations loaded: ${locations.length}`); 
            drawRandomPlace();
        })
        .catch(err => console.error("Error loading locations:", err));

    document.getElementById("random-location").addEventListener("click", drawRandomPlace);
}

// Fetch and parse the CSV file
async function loadLocations() {
    try {
        const response = await fetch(LOCATIONS_PATH);
        if (!response.ok) {
            throw new Error(`Failed to load locations from ${LOCATIONS_PATH}: ${response.statusText}`);
        }

        const csvText = await response.text();
        parseCSV(csvText);
    } catch (err) {
        console.error("Error fetching locations:", err);
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const rows = csvText.split("\n").slice(1);
    locations = rows
        .map(row => {
            const [lat, lng] = row.split(",").map(Number);
            return { lat, lng };
        })
        .filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng)); // Filter out invalid rows

    console.log(`Parsed ${locations.length} valid locations.`);
}

// Get a random location from the loaded locations
function getRandomCoordinates() {
    if (locations.length === 0) {
        console.error("No locations available. Check your CSV file.");
        return { lat: 0, lng: 0 }; // Default to the equator if no locations are found
    }

    const randomIndex = Math.floor(Math.random() * locations.length);
    const randomLocation = locations[randomIndex];

    console.log(`Chosen location index: ${randomIndex}`);

    return randomLocation;
}

// Display a random place on the map
function drawRandomPlace() {
    const coords = getRandomCoordinates();

    // Directly display the location on the map
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
            position: coords,
            pov: {
                heading: 34,
                pitch: 10
            },
            visible: true,
            addressControl: false
        }
    );

    console.log(`Displayed location: Latitude ${coords.lat}, Longitude ${coords.lng}`);
}
