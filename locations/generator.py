import math
import logging
from shapely.geometry import Point
from shapely.strtree import STRtree
import csv              # CSV file I/O
from tqdm import tqdm   # Progress bar
import geopandas as gpd # Spatial data
import concurrent.futures
import aiohttp
import asyncio
import random
import os
import visualize_points

##############################     OPTIONS     ##############################

##########   PARAMETERS FOR POINT GENERATION   ##########
BOUNDS = (-90.0, -180.0, 90.0, 180.0)       #? Bounds of search - whole Earth by default
POINT_DEGREE_BUFFER = 0.2                   #? Buffer distance around the point to check if it's on land
SAMPLES = 5000000                           #? Number of points to generate on the Earth's surface
                                            #? - 5mln gives around 120k points with Street View coverage
                                            #? - large number causes more processing before making progress tracked by a progress bar (just wait a minute)
                                            
#####   PARAMETERS FOR STREET VIEW COVERAGE CHECK   #####
COVERAGE_SEARCH_RADIUS = 7000                   #? Radius of the area of searching for Street View coverage (meters)
MAX_REQUESTS_PER_SECOND = 490                   #? Maximum number of requests to Street View Static API per second (prevent rate limiting)
RETRY_JITTER = 0.1                              #? Jitter for retrying points with unofficial Street View coverage
RETRIES = 5                                     #? Number of retries for each point with unofficial Street View coverage

##########   PATHS   ##########
MAP_NAME = "UR_MAP_NAME_HERE"               #? Name of the map
MAPS_DIRECTORY = "locations_sets/"          #? Directory to save maps (better don't change it)
POINTS_LOAD_MAP_PATH = None                 #? Load points from a previous map (set to None to generate new points)              

##########   FLAGS   ##########
ONLY_GENERATE_POINTS = False                #? Only generate points, do not check Street View coverage
UNOFFICIAL_COVERAGE = False                 #? Include unofficial Street View coverage
LOGGING = True                              #? Enable logging
VISUALIZE_LOCATIONS = True                  #? Visualize locations with Street View coverage
VISUALIZE_POINTS = False                    #? Visualize generated points (slow and not useful)

# BOUNDS = (40.6, -74.150435, 40.925911, -73.890883) #! New York City for testing
# SAMPLES = 1000                            #! small number of points for testing
# COVERAGE_SEARCH_RADIUS = 500000           #! big radius for testing (500 km)

#############################################################################

def read_api_key():
    try:
        with open("../apikey.txt", "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        logger.error("API key file not found. Please create apikey.txt with your API key.")
        raise

API_KEY = read_api_key()

STREET_VIEW_METADATA_URL = "https://maps.googleapis.com/maps/api/streetview/metadata"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REQUEST_SEMAPHORE = asyncio.Semaphore(MAX_REQUESTS_PER_SECOND)

if not LOGGING:
    logging.disable(logging.CRITICAL)

with open("coverage_countries/countries_codes.txt", "r", encoding="utf-8") as file:
    COVERAGE_COUNTRY_CODES = {line.strip() for line in file.readlines()}
    
world = gpd.read_file("coverage_countries/land/ne_50m_land.shp")
land_geometries = world['geometry']
spatial_index = STRtree(land_geometries)

def is_point_on_land(lat, lon, buffer_distance=POINT_DEGREE_BUFFER):
    point = Point(lon, lat)
    buffered_point = point.buffer(buffer_distance)
    possible_matches = spatial_index.query(buffered_point)
    
    for idx in possible_matches:
        geom = land_geometries.iloc[idx]  # Get the geometry from the GeoDataFrame
        if geom.intersects(buffered_point):  # Check if the point is on land
            return True
    return False

def get_country_code(lat, lon):
    point = Point(lon, lat)
    # for idx, country in world.iterrows():
    #     if country['geometry'].contains(point):
    #         return country['ISO_A2_EH'], country['ADMIN']
    
    buffered_point = point.buffer(1)  # Create a buffer around the point
    for idx, country in world.iterrows():
        if country['geometry'].intersects(buffered_point):
            return country['ISO_A2_EH'], country['ADMIN']
    return None

def generate_point(i, samples, phi):
    y = 1 - (i / float(samples - 1)) * 2  # y goes from 1 to -1
    radius = math.sqrt(1 - y * y)  # radius at y

    theta = phi * i  # golden angle increment

    x = math.cos(theta) * radius
    z = math.sin(theta) * radius

    # Convert Cartesian to spherical (latitude and longitude)
    latitude = math.degrees(math.asin(y))  # Latitude in degrees
    longitude = math.degrees(math.atan2(z, x))  # Longitude in degrees

    if is_point_on_land(latitude, longitude):
        return (latitude, longitude)
    return None

def fibonacci_sphere_lat_lon(samples=SAMPLES):
    """
    Generates points on a sphere using the Fibonacci sphere method and returns
    them in latitude and longitude format.
    """
    points = []
    phi = math.pi * (math.sqrt(5.) - 1.)  # golden angle in radians

    with tqdm(total=samples, desc="Generating points") as pbar:
        # Use ThreadPoolExecutor to parallelize the process
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = [executor.submit(generate_point, i, samples, phi) for i in range(samples)]

            for future in futures:
                result = future.result()
                if result:
                    points.append(result)
                    # result = get_country_code(latitude, longitude)
                    # country_code, name = result
                    # if (country_code): # and country_code in COVERAGE_COUNTRY_CODES
                    #   points.append((latitude, longitude))
                pbar.update(1)

    return points


def save_points_to_csv(points, filename):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Latitude", "Longitude"])
        writer.writerows(points)
    logger.info(f"Points saved to {filename}")
    
def load_points_from_csv(filename):
    points = []
    try:
        with open(filename, mode='r', newline='') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                lat, lon = float(row[0]), float(row[1])
                points.append((lat, lon))
        logger.info(f"Loaded {len(points)} points from {filename}")
    except Exception as e:
        logger.error(f"Error loading points from CSV: {e}")
    return points

async def check_street_view_async(lat, lng, session, retry_limit=RETRIES):
        async with REQUEST_SEMAPHORE:
            retry_count = 0
            original_lat, original_lng = lat, lng
            while retry_count < retry_limit:
                params = {
                    'location': f"{lat},{lng}",
                    'radius': COVERAGE_SEARCH_RADIUS,
                    'key': API_KEY
                }
                try:
                    async with session.get(STREET_VIEW_METADATA_URL, params=params) as response:
                        if response.status == 200:
                            data = await response.json()
                            status = data.get('status', '')
                            if status == 'OK':
                                pano_id = data.get('pano_id')
                                copyright_info = data.get('copyright', '')
                                if pano_id and (copyright_info == '© Google'):
                                    new_location = data.get('location', {})
                                    return True, (new_location.get('lat', lat), new_location.get('lng', lng))
                                else:
                                    retry_count += 1
                                    offset_lat = original_lat + random.uniform(-RETRY_JITTER, RETRY_JITTER)  # Adjust lat by small random value
                                    offset_lng = original_lng + random.uniform(-RETRY_JITTER, RETRY_JITTER)  # Adjust lng by small random value
                                    lat, lng = offset_lat, offset_lng
                            else:
                                return False, (lat, lng)
                        elif response.status == 429:  # Rate-limiting
                            logger.warning(f"Rate limit hit for ({lat}, {lng}). Retrying...")
                            return await retry_check_street_view(lat, lng, session)
                        else:
                            logger.error(f"Error {response.status} for ({lat}, {lng})")
                            return False, (lat, lng)
                except Exception as e:
                    logger.error(f"Error for location ({lat}, {lng}): {e}")
                    return False, (lat, lng)
            return False, (lat, lng)
            
async def retry_check_street_view(lat, lng, session, retries=3, delay=2):
    """Retry logic for handling rate-limiting."""
    for attempt in range(retries):
        await asyncio.sleep(delay)
        logger.info(f"Retrying ({lat}, {lng}), attempt {attempt + 1}")
        result = await check_street_view_async(lat, lng, session)
        if result[0]:  # Found Street View coverage
            return result
    logger.error(f"Failed to check ({lat}, {lng}) after {retries} retries")
    return False, (lat, lng)

# Asynchronous wrapper to call check_street_view for each point
async def check_street_view_wrapper_async(point, session, pbar):
    lat, lng = point
    has_street_view, new_coords = await check_street_view_async(lat, lng, session)
    pbar.update(1)
    return has_street_view, new_coords

# Main function to filter points with street view, using async calls
async def filter_points_with_street_view_async(points):
    street_view_points = set()
    async with aiohttp.ClientSession() as session:
        with tqdm(total=len(points), desc="Checking Street View", dynamic_ncols=True) as pbar:
            tasks = [check_street_view_wrapper_async(point, session, pbar) for point in points]

            results = await asyncio.gather(*tasks)
            for has_street_view, new_coords in results:
                if has_street_view:
                    street_view_points.add(new_coords)
    return street_view_points


def save_map_data(map_directory, map_name, points_generated, street_view_found):
    info_filename = os.path.join(map_directory, f"info.txt")
    with open(info_filename, 'w') as file:
        # Write general map generation info
        file.write(f"Map Name: {map_name}\n")
        file.write(f"Map Directory: {map_directory}\n")
        file.write(f"Points Generated: {points_generated}\n")
        file.write(f"Street View Locations Found: {len(street_view_found)}\n")
        
        # Write map generation parameters
        file.write("\nMap Generation Parameters:\n")
        file.write(f"BOUNDS: {BOUNDS}\n")
        file.write(f"POINT_DEGREE_BUFFER: {POINT_DEGREE_BUFFER} degrees\n")
        file.write(f"SAMPLES: {SAMPLES}\n")
        file.write(f"COVERAGE_SEARCH_RADIUS: {COVERAGE_SEARCH_RADIUS} meters\n")
        file.write(f"MAX_REQUESTS_PER_SECOND: {MAX_REQUESTS_PER_SECOND}\n")
        file.write(f"RETRY_JITTER: {RETRY_JITTER}\n")
        file.write(f"RETRIES: {RETRIES}\n")
        
        # Paths and Flags
        file.write("\nPaths and Flags:\n")
        file.write(f"MAPS_DIRECTORY: {MAPS_DIRECTORY}\n")
        file.write(f"POINTS_LOAD_MAP_PATH: {POINTS_LOAD_MAP_PATH}\n")
        file.write(f"ONLY_GENERATE_POINTS: {ONLY_GENERATE_POINTS}\n")
        file.write(f"UNOFFICIAL_COVERAGE: {UNOFFICIAL_COVERAGE}\n")
        file.write(f"LOGGING: {LOGGING}\n")
        file.write(f"VISUALIZE_LOCATIONS: {VISUALIZE_LOCATIONS}\n")
        file.write(f"VISUALIZE_POINTS: {VISUALIZE_POINTS}\n")

    logger.info(f"Map generation details saved to {info_filename}")


if __name__ == "__main__":
    if POINTS_LOAD_MAP_PATH:
        points = load_points_from_csv(MAPS_DIRECTORY + POINTS_LOAD_MAP_PATH + "/points.csv")
        random.shuffle(points)
        
        logger.info(f"Loaded {len(points)} points. Checking Street View coverage...")
    else:  
        points = fibonacci_sphere_lat_lon()
        random.shuffle(points)
        map_directory = MAPS_DIRECTORY + MAP_NAME
        os.makedirs(map_directory, exist_ok=True)
        save_points_to_csv(points, map_directory + "/points.csv")
        
        logger.info(f"Generated {len(points)} points. Checking Street View coverage...")
    
    if not ONLY_GENERATE_POINTS:
        street_view_points = asyncio.run(filter_points_with_street_view_async(points))
        
        logger.info(f"Found {len(street_view_points)} locations with Street View coverage")
        
        map_directory = MAPS_DIRECTORY + MAP_NAME
        os.makedirs(map_directory, exist_ok=True)
        save_points_to_csv(street_view_points, map_directory + "/locations.csv")
        
        logger.info(f"Map " + MAP_NAME + " created")
        
    if VISUALIZE_POINTS or VISUALIZE_LOCATIONS:
        visualize_points.visualize_points(maps_path=MAPS_DIRECTORY, map_name=MAP_NAME, visualize_points=VISUALIZE_POINTS, visualize_locations=VISUALIZE_LOCATIONS)

    save_map_data(map_directory, MAP_NAME, len(points), street_view_points)