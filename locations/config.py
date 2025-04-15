import logging

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
MAP_NAME = "test"                           #? Name of the map
MAPS_DIRECTORY = "locations_sets/"          #? Directory to save maps (better don't change it)
POINTS_LOAD_MAP_PATH = "locations_sets/equally_distributed_world_5mln/"                 #? Load points from a previous map (set to None to generate new points)              

##########   FLAGS   ##########
ONLY_GENERATE_POINTS = False                #? Only generate points, do not check Street View coverage
UNOFFICIAL_COVERAGE = False                 #? Include unofficial Street View coverage
LOGGING = True                              #? Enable logging
VISUALIZE_LOCATIONS = True                  #? Visualize locations with Street View coverage
VISUALIZE_POINTS = False                    #? Visualize generated points (slow and not useful)

# BOUNDS = (40.6, -74.150435, 40.925911, -73.890883) #! New York City for testing
# SAMPLES = 1000                            #! small number of points for testing
# COVERAGE_SEARCH_RADIUS = 500000           #! big radius for testing (500 km)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
if not LOGGING:
    logging.disable(logging.CRITICAL)

#############################################################################