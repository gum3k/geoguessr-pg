import math
import concurrent.futures
import math
from shapely.geometry import Point
from tqdm import tqdm
from config import *
import geopandas as gpd # Spatial data
from shapely.strtree import STRtree


#world = gpd.read_file("coverage_countries/boundaries/boundaries.shp")
world = gpd.read_file("coverage_countries/land/ne_50m_land.shp")
land_geometries = world['geometry']
spatial_index = STRtree(land_geometries)

def is_point_on_land(lat, lon, buffer_distance=POINT_DEGREE_BUFFER):
    point = Point(lon, lat)
    buffered_point = point.buffer(buffer_distance)
    possible_matches = spatial_index.query(buffered_point)
    
    for idx in possible_matches:
        geom = land_geometries.iloc[idx]
        if geom.intersects(buffered_point):  # check if the point is on land
            return True
    return False

def is_point_on_land_batch(batch, buffer_distance=POINT_DEGREE_BUFFER):
    return [point for point in batch if is_point_on_land(point[0], point[1], buffer_distance)]

def filter_points_on_land(points, batch_size=500, max_workers=None):
    points_on_land = []
    batches = [points[i:i + batch_size] for i in range(0, len(points), batch_size)]
    with tqdm(total=len(points), desc="Filtering points on land") as pbar:
        
        with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(is_point_on_land_batch, batch): batch for batch in batches}
            
            for future in concurrent.futures.as_completed(futures):
                batch = futures[future]
                try:
                    points_on_land.extend(future.result())
                except Exception as e:
                    logger.error(f"Error processing batch: {e}")
                pbar.update(len(batch))

    return points_on_land

def get_country_code(lat, lon):
    point = Point(lon, lat)
    # for idx, country in world.iterrows():
    #     if country['geometry'].contains(point):
    #         return country['ISO_A2_EH'], country['ADMIN']
    
    buffered_point = point.buffer(1)  # create a buffer around the point
    for idx, country in world.iterrows():
        if country['geometry'].intersects(buffered_point):
            return country['ISO_A2_EH'], country['ADMIN']
    return None

def generate_point(i, samples, phi):
    y = 1 - (i / float(samples - 1)) * 2    # y goes from 1 to -1
    radius = math.sqrt(1 - y * y)           # radius at y

    theta = phi * i  # golden angle increment

    x = math.cos(theta) * radius
    z = math.sin(theta) * radius

    # convert Cartesian to spherical (latitude and longitude)
    latitude = math.degrees(math.asin(y))       # latitude in degrees
    longitude = math.degrees(math.atan2(z, x))  # longitude in degrees

    return latitude, longitude

def fibonacci_sphere_lat_lon(samples=SAMPLES, batch_size=100, max_workers=None):
    """
    Generates points on a sphere using the Fibonacci sphere method, filters them
    to include only points on land, and returns them in latitude and longitude format.
    """
    points = []
    phi = math.pi * (math.sqrt(5.) - 1.)  # golden angle in radians

    with tqdm(total=samples, desc="Generating points") as pbar:
        for i in range(samples):
            result = generate_point(i, samples, phi)
            if result:
                points.append(result)
                # result = get_country_code(latitude, longitude)
                # country_code, name = result
                # if (country_code): # and country_code in COVERAGE_COUNTRY_CODES
                # points.append((latitude, longitude))
            pbar.update(1)

    # Filter points to include only those on land
    points_on_land = filter_points_on_land(points, batch_size=batch_size, max_workers=max_workers)

    return points_on_land


