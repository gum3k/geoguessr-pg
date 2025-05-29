from asyncio.log import logger
from config import *
import csv
import os


def read_api_key():
    try:
        with open("../apikey.txt", "r") as file:
            return file.read().strip()
    except FileNotFoundError:
        logger.error("API key file not found. Please create apikey.txt with your API key.")
        raise
    

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
            next(reader)  # skip the header
            for row in reader:
                lat, lon = float(row[0]), float(row[1])
                points.append((lat, lon))
        logger.info(f"Loaded {len(points)} points from {filename}")
    except Exception as e:
        logger.error(f"Error loading points from CSV: {e}")
    return points

def load_existing_street_view_points(file_path):
    points = []
    if os.path.exists(file_path):
        with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader, None)  # skip header
            for row in reader:
                if len(row) >= 2:
                    points.append((float(row[0]), float(row[1])))
    return points

def save_map_data(map_directory, map_name, points_generated, street_view_found, min_point, max_point):
    info_filename = os.path.join(map_directory, f"info.txt")
    with open(info_filename, 'w') as file:
        # write general map generation info
        file.write(f"Map Name: {map_name}\n")
        file.write(f"Map Description: {DESCRIPTION}\n")
        file.write(f"Lower Left Corner: {min_point}\n")
        file.write(f"Upper Right Corner: {max_point}\n")
        file.write(f"Points Generated: {points_generated}\n")
        file.write(f"Street View Locations Found: {street_view_found}\n")
        
        # write map generation parameters
        file.write("\nMap Generation Parameters:\n")
        file.write(f"BOUNDS: {BOUNDS}\n")
        file.write(f"POINT_DEGREE_BUFFER: {POINT_DEGREE_BUFFER} degrees\n")
        file.write(f"SAMPLES: {SAMPLES}\n")
        file.write(f"COVERAGE_SEARCH_RADIUS: {COVERAGE_SEARCH_RADIUS} meters\n")
        file.write(f"MAX_REQUESTS_PER_SECOND: {MAX_REQUESTS_PER_SECOND}\n")
        file.write(f"RETRY_JITTER: {RETRY_JITTER}\n")
        file.write(f"RETRIES: {RETRIES}\n")
        
        # paths and flags
        file.write("\nPaths and Flags:\n")
        file.write(f"MAPS_DIRECTORY: {MAPS_DIRECTORY}\n")
        file.write(f"POINTS_LOAD_MAP_PATH: {POINTS_LOAD_MAP_PATH}\n")
        file.write(f"ONLY_GENERATE_POINTS: {ONLY_GENERATE_POINTS}\n")
        file.write(f"UNOFFICIAL_COVERAGE: {UNOFFICIAL_COVERAGE}\n")
        file.write(f"LOGGING: {LOGGING}\n")
        file.write(f"VISUALIZE_LOCATIONS: {VISUALIZE_LOCATIONS}\n")
        file.write(f"VISUALIZE_POINTS: {VISUALIZE_POINTS}\n")

    logger.info(f"Map generation details saved to {info_filename}")