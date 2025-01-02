import googlemaps
import math
import time
import requests
import logging
import csv

API_KEY = "AIzaSyBrI_bZTLQhViRpIPQW5r9fwlgqs80Jz9A"
STREET_VIEW_METADATA_URL = "https://maps.googleapis.com/maps/api/streetview/metadata"
OFFICIAL_COVERAGE = True

# BOUNDS = (40.6, -74.150435, 40.925911, -73.890883) # New York City
BOUNDS = (-90.0, -180.0, 90.0, 180.0)   # Bounds of search - whole Earth
COVERAGE_SEARCH_RADIUS = 500            # Radius of the area of searching for Street View coverage
SPACING = 1000                          # Spacing between generated points

SPACING = 1000000 #! big spacing for testing
COVERAGE_SEARCH_RADIUS = 5000 #! big radius for testing

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# logging.disable(logging.CRITICAL) # disable logging

def generate_random_points(bounds, spacing):
    min_lat, min_lng, max_lat, max_lng = bounds # bounds of the area to generate points
    points = set()

    degree_spacing_lat = spacing / 111320  # spacing between points, 1 degree latitude ≈ 111.32 km
    
    lat = min_lat
    while lat <= max_lat:
        degree_spacing_lng = spacing / (111320 * math.cos(math.radians(lat)))  # adjusted for Earth's curvature

        lng = min_lng
        while lng <= max_lng:
            points.add((round(lat, 6), round(lng, 6)))
            lng += degree_spacing_lng

        lat += degree_spacing_lat

    return list(points) # list of unique points (lat, lng)

def check_street_view(lat, lng):
    params = {
        'location': f"{lat},{lng}",
        'radius': COVERAGE_SEARCH_RADIUS,  # meters
        'key': API_KEY
    }
    response = requests.get(STREET_VIEW_METADATA_URL, params=params)
    
    if response.status_code == 200:
        data = response.json()
        status = data.get('status', '')
        
        if status == 'OK':
            pano_id = data.get('pano_id')
            if pano_id or not OFFICIAL_COVERAGE:
                new_location = data.get('location', {})
                logger.info(f"Found official Street View imagery at ({lat}, {lng})")
                return True, (new_location.get('lat', lat), new_location.get('lng', lng))
            else:
                logger.warning(f"No valid pano_id found at ({lat}, {lng}) - Skipping")
            return False, (lat, lng)
        
        elif status == 'ZERO_RESULTS':
                logger.info(f"No Street View imagery found at ({lat}, {lng})")
                return False, (lat, lng)
        else:
                logger.error(f"Error checking location ({lat}, {lng}): Status: {status}")
                return False, (lat, lng)
    else:
        logger.error(f"HTTP error checking location ({lat}, {lng}): Status code {response.status_code}")
        return False, (lat, lng)
    

def filter_points_with_street_view(points):
    street_view_points = []
    for point in points:
        lat, lng = point
        try:
            has_street_view, new_coords = check_street_view(lat, lng)
            if has_street_view:
                street_view_points.append(new_coords)
                logger.info(f"Found point: {new_coords}")
        except Exception as e:
            logger.error(f"Error checking point {point}: {e}")

    return street_view_points # list of points with Street View coverage (lat, lng)

def save_points_to_csv(points, filename):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Latitude", "Longitude"])
        for point in points:
            writer.writerow(point)
    logger.info(f"Points saved to {filename}")

if __name__ == "__main__":
    points = generate_random_points(BOUNDS, SPACING)
    logger.info(f"Generated {len(points)} points. Checking Street View coverage...")

    street_view_points = filter_points_with_street_view(points)

    logger.info(f"Found {len(street_view_points)} locations with Street View coverage:")
    for point in street_view_points:
        logger.info(point)
        
    save_points_to_csv(street_view_points, "locations_sets/generated_locations.csv")
