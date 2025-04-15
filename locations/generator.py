import asyncio
import random
import os
from config import *
import utils.visualize_points as visualize_points
from utils.file_operations import *
from utils.points_generation import fibonacci_sphere_lat_lon
from utils.check_street_view import filter_points_with_street_view_async

##########################################################
#### >>> YOU CAN CHANGE OPTIONS IN CONFIG.PY FILE <<< ####
##########################################################

with open("coverage_countries/countries_codes.txt", "r", encoding="utf-8") as file:
    COVERAGE_COUNTRY_CODES = {line.strip() for line in file.readlines()}

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