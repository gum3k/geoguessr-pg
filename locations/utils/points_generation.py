import math
import concurrent.futures
import math
from shapely.geometry import Point
from tqdm import tqdm
from config import *
import geopandas as gpd # Spatial data
from shapely.strtree import STRtree

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
        # parallelize the process
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