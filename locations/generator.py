import asyncio
import random
import os
from config import *
import utils.visualize_points as visualize_points
from utils.file_operations import *
from utils.points_generation import fibonacci_sphere_lat_lon
from utils.check_street_view import filter_points_with_street_view_async, lookup_street_view_points
import shutil

##########################################################
#### >>> YOU CAN CHANGE OPTIONS IN CONFIG.PY FILE <<< #### 
##########################################################

if __name__ == "__main__":
    if POINTS_LOAD:
        points = load_points_from_csv(POINTS_LOAD_MAP_PATH + "/points.csv")
        random.shuffle(points)
        
        logger.info(f"Loaded {len(points)} points. Checking Street View coverage...")
    else:  
        points = fibonacci_sphere_lat_lon()
        random.shuffle(points)
        map_directory = MAPS_DIRECTORY + MAP_DIRECTORY
        os.makedirs(map_directory, exist_ok=True)
        save_points_to_csv(points, map_directory + "/points.csv")
        
        logger.info(f"Generated {len(points)} points. Checking Street View coverage...")
    
    if not ONLY_GENERATE_POINTS:
        if LOOKUP_POINTS:
            looked_up, remaining = lookup_street_view_points(points)
            street_view_points = asyncio.run(filter_points_with_street_view_async(remaining))
            street_view_points.update(looked_up)
        else:
            street_view_points = asyncio.run(filter_points_with_street_view_async(points))
        
        logger.info(f"Found {len(street_view_points)} locations with Street View coverage")
        
        map_directory = MAPS_DIRECTORY + MAP_DIRECTORY
        os.makedirs(map_directory, exist_ok=True)
        save_points_to_csv(street_view_points, map_directory + "/locations.csv")
        
        logger.info(f"Map " + MAP_DIRECTORY + " created")
        
    if VISUALIZE_POINTS or VISUALIZE_LOCATIONS:
        logger.info("Visualizing locations...")
        if not POINTS_LOAD or not os.path.exists(POINTS_LOAD_MAP_PATH + "/locations.html"):
            visualize_points.visualize_points(maps_path=MAPS_DIRECTORY, MAP_DIRECTORY=MAP_DIRECTORY)

    save_map_data(map_directory, MAP_NAME, len(points), len(street_view_points))
    images_dir = os.path.join(map_directory, "images")
    os.makedirs(images_dir, exist_ok=True)
    shutil.copyfile("mapito.jpg", os.path.join(images_dir, "thumbnail.jpg"))