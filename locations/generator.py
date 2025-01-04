import math
import logging
from shapely.geometry import Point
from shapely.strtree import STRtree
import requests         # HTTP requests
import csv              # CSV file I/O
from tqdm import tqdm   # Progress bar
import geopandas as gpd # Spatial data
import concurrent.futures
import aiohttp
import asyncio

API_KEY = "AIzaSyBObjPDqUwbBiaL-z61tccf7Jkyz_4EqrY"
STREET_VIEW_METADATA_URL = "https://maps.googleapis.com/maps/api/streetview/metadata"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


##############################     OPTIONS     ##############################

BOUNDS = (-90.0, -180.0, 90.0, 180.0)   #? Bounds of search - whole Earth by default
COVERAGE_SEARCH_RADIUS = 30000          #? Radius of the area of searching for Street View coverage (meters)
SAMPLES = 2000000                        #? Number of points to generate on the Earth's surface

UNOFFICIAL_COVERAGE = False             #? Include unofficial Street View coverage
# logging.disable(logging.CRITICAL)     #? Disable logging

# BOUNDS = (40.6, -74.150435, 40.925911, -73.890883) #! New York City for testing
# SAMPLES = 1000                            #! small number of points for testing
# COVERAGE_SEARCH_RADIUS = 500000           #! big radius for testing (500 km)

#############################################################################


with open("coverage_countries/countries_codes.txt", "r", encoding="utf-8") as file:
    COVERAGE_COUNTRY_CODES = {line.strip() for line in file.readlines()}
    
world = gpd.read_file("coverage_countries/land/ne_50m_land.shp")
land_geometries = world['geometry']
spatial_index = STRtree(land_geometries)

def is_point_on_land(lat, lon, buffer_distance=0.2):
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
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
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
            copyright_info = data.get('copyright', '')
            if (copyright_info == '© Google' or UNOFFICIAL_COVERAGE) and pano_id:
                new_location = data.get('location', {})
                # logger.info(f"Found official Street View imagery at ({lat}, {lng})")
                return True, (new_location.get('lat', lat), new_location.get('lng', lng))
            # else:
            #     logger.warning(f"No valid pano_id found at ({lat}, {lng}) - Skipping")
            return False, (lat, lng)
        else:
            return False, (lat, lng)

        # elif status == 'ZERO_RESULTS':
        #     logger.info(f"No Street View imagery found at ({lat}, {lng})")
        #     return False, (lat, lng)
        # else:
        #     logger.error(f"Error checking location ({lat}, {lng}): Status: {status}")
        #     return False, (lat, lng)
    else:
        logger.error(f"HTTP error checking location ({lat}, {lng}): Status code {response.status_code}")
        return False, (lat, lng)

def filter_points_with_street_view_parallel(points):
    street_view_points = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(tqdm(executor.map(check_street_view_wrapper, points), total=len(points), desc="Checking Street View"))
    for has_street_view, new_coords in results:
        if has_street_view:
            street_view_points.append(new_coords)
    return street_view_points

def check_street_view_wrapper(point):
    lat, lng = point
    return check_street_view(lat, lng)


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


async def check_street_view_async(lat, lng, session):
    params = {
        'location': f"{lat},{lng}",
        'radius': COVERAGE_SEARCH_RADIUS,  # meters
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
                    if (copyright_info == '© Google' or UNOFFICIAL_COVERAGE) and pano_id:
                        new_location = data.get('location', {})
                        return True, (new_location.get('lat', lat), new_location.get('lng', lng))
                return False, (lat, lng)
            else:
                return False, (lat, lng)
    except Exception as e:
        # Log the error (you can log the exception here)
        logger.error(f"Error checking location ({lat}, {lng}): {e}")
        return False, (lat, lng)

# Asynchronous wrapper to call check_street_view for each point
async def check_street_view_wrapper_async(point, session):
    lat, lng = point
    return await check_street_view_async(lat, lng, session)

# Main function to filter points with street view, using async calls
async def filter_points_with_street_view_async(points):
    street_view_points = []
    async with aiohttp.ClientSession() as session:
        with tqdm(total=len(points), desc="Checking Street View", dynamic_ncols=True) as pbar:
            tasks = []
            for point in points:
                task = check_street_view_wrapper_async(point, session)
                tasks.append(task)

            for future in asyncio.as_completed(tasks):
                has_street_view, new_coords = await future
                if has_street_view:
                    street_view_points.append(new_coords)
                pbar.update(1)  # Update progress bar after each completed task


    return street_view_points


if __name__ == "__main__":
    #points = fibonacci_sphere_lat_lon()
    #save_points_to_csv(points, "locations_sets/equally_distributed_world_points.csv")
    points = load_points_from_csv("locations_sets/equally_distributed_world_2mln/equally_distributed_world_points.csv")
    
    logger.info(f"Generated {len(points)} points. Checking Street View coverage...")

    #street_view_points = filter_points_with_street_view_parallel(points)
    street_view_points = asyncio.run(filter_points_with_street_view_async(points))
    logger.info(f"Found {len(street_view_points)} locations with Street View coverage:")

    save_points_to_csv(street_view_points, "locations_sets/equally_distributed_world.csv")
