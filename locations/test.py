import requests
import logging

# Constants
API_KEY = "AIzaSyBObjPDqUwbBiaL-z61tccf7Jkyz_4EqrY"
STREET_VIEW_METADATA_URL = "https://maps.googleapis.com/maps/api/streetview/metadata"

# Logging Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def make_street_view_request(lat, lng, radius, use_official):
    """
    Make a request to the Google Street View API for a specific location.
    
    Args:
        lat (float): Latitude of the point.
        lng (float): Longitude of the point.
        radius (int): Search radius in meters.
        use_official (bool): Whether to include only official Street View imagery.
    
    Returns:
        dict: The response JSON.
    """
    params = {
        'location': f"{lat},{lng}",
        'radius': radius,
        'key': API_KEY
    }

    response = requests.get(STREET_VIEW_METADATA_URL, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        logger.error(f"Error: HTTP {response.status_code} for location ({lat}, {lng})")
        return None

if __name__ == "__main__":
    # Test Coordinates
    lat, lng = 0.373996, 32.596070

  # San Francisco, CA (example coordinates)
    radius = 500  # Search radius in meters

    logger.info("Testing with official Street View imagery...")
    official_response = make_street_view_request(lat, lng, radius, use_official=True)
    print("\nOfficial Imagery Response:")
    print(official_response)

    logger.info("Testing with unofficial Street View imagery...")
    unofficial_response = make_street_view_request(54.460663, 18.526967, radius, use_official=False)
    print("\nUnofficial Imagery Response:")
    print(unofficial_response)
