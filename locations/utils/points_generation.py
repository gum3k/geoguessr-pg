import math
import concurrent.futures
import math
from shapely.geometry import Point
from tqdm import tqdm
from config import *
import geopandas as gpd # Spatial data
from shapely.strtree import STRtree


countries = gpd.read_file("shapefiles/boundaries/boundaries.shp")
world = gpd.read_file("shapefiles/land/ne_50m_land.shp")

land_geometries = world['geometry']
spatial_index = STRtree(land_geometries)

def is_point_in_country(lat, lon):
    country_geom = countries[countries['shapeName'] == COUNTRY_NAME].geometry.iloc[0]
    point = Point(lon, lat)
    return country_geom.contains(point)

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

def get_country_bbox(gdf, country_name):
    country_geom = gdf[gdf['shapeName'] == country_name]
    if not country_geom.empty:
        return country_geom.total_bounds  # (minx, miny, maxx, maxy) = (lon1, lat1, lon2, lat2)
    else:
        raise ValueError(f"Country '{country_name}' not found in shapefile.")

def generate_point(i, samples, phi, min_lat=-90, max_lat=90, min_lon=-180, max_lon=180):
    y = 1 - (i / float(samples - 1)) * 2    # y goes from 1 to -1
    radius = math.sqrt(1 - y * y)           # radius at y

    theta = phi * i  # golden angle increment

    x = math.cos(theta) * radius
    z = math.sin(theta) * radius

    # convert Cartesian to spherical (latitude and longitude)
    latitude = math.degrees(math.asin(y))       # latitude in degrees
    longitude = math.degrees(math.atan2(z, x))  # longitude in degrees
    
    latitude = min_lat + ((latitude + 90) / 180) * (max_lat - min_lat)
    longitude = min_lon + ((longitude + 180) / 360) * (max_lon - min_lon)

    return latitude, longitude

def fibonacci_sphere_lat_lon(samples=SAMPLES, batch_size=100, max_workers=None, country_name=COUNTRY_NAME):
    points = []
    phi = math.pi * (math.sqrt(5.) - 1.)  # golden angle in radians

    if country_name:
        countries = gpd.read_file("shapefiles/boundaries/boundaries.shp")
        min_lon, min_lat, max_lon, max_lat = get_country_bbox(countries, country_name)
    else:
        min_lat, max_lat = -90, 90
        min_lon, max_lon = -180, 180

    with tqdm(total=samples, desc="Generating points") as pbar:
        for i in range(samples):
            lat, lon = generate_point(i, samples, phi, min_lat, max_lat, min_lon, max_lon)
            points.append((lat, lon))
            pbar.update(1)

    # Filter to points on land only
    points_on_land = filter_points_on_land(points, batch_size=batch_size, max_workers=max_workers)

    return points_on_land