import logging

##############################     OPTIONS     ##############################

##########   PARAMETERS FOR POINT GENERATION   ##########
BOUNDS = (-90.0, -180.0, 90.0, 180.0)       #? Bounds of search - whole Earth by default
POINT_DEGREE_BUFFER = 0.2                   #? Buffer distance around the point to check if it's on land
SAMPLES = 500000                           #? Number of points to generate on the Earth's surface
                                            #? - 5mln gives around 120k points with Street View coverage
                                            #? - large number causes more processing before making progress tracked by a progress bar (just wait a minute)
COUNTRY_NAME = "Poland"                         #? Name of the country to generate points in (None for whole Earth), list of countries under options 
        
                                            
#####   PARAMETERS FOR STREET VIEW COVERAGE CHECK   #####
COVERAGE_SEARCH_RADIUS = 7000                   #? Radius of the area of searching for Street View coverage (meters)
MAX_REQUESTS_PER_SECOND = 490                   #? Maximum number of requests to Street View Static API per second (prevent rate limiting)
RETRY_JITTER = 0.1                              #? Jitter for retrying points with unofficial Street View coverage
RETRIES = 5                                     #? Number of retries for each point with unofficial Street View coverage
LOOKUP_TRESHOLD = COVERAGE_SEARCH_RADIUS / 111320  #? Distance threshold for checking if a point is near an existing point (in degrees)
                                                #? Convert radius from meters to degrees (approximation)

##########   PATHS   ##########
MAP_NAME = "Poland_500k"                                       #? Name of the map
MAPS_DIRECTORY = "locations_sets/"                      #? Directory to save maps (better don't change it)
POINTS_LOAD_MAP_PATH = "locations_sets/test/"                 #? Load points from a previous map (set to None to generate new points)              
LOOKUP_PATH = "./lookup/street_view_points.csv"

##########   FLAGS   ##########
ONLY_GENERATE_POINTS = False                #? Only generate points, do not check Street View coverage
UNOFFICIAL_COVERAGE = False                 #? Include unofficial Street View coverage
LOGGING = True                              #? Enable logging
VISUALIZE_LOCATIONS = True                  #? Visualize locations with Street View coverage
VISUALIZE_POINTS = False                    #? Visualize generated points (slow and not useful)
POINTS_LOAD = False                         #? Load points from a previous map (set to False to generate new points)
LOOKUP_POINTS = True                        #? Use lookup table to filter points (faster than checking all points)

# BOUNDS = (40.6, -74.150435, 40.925911, -73.890883) #! New York City for testing

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
if not LOGGING:
    logging.disable(logging.CRITICAL)

#############################################################################

# Afghanistan, United Kingdom, Albania, Algeria, United States, Antarctica, Antigua & Barbuda, Argentina, Andorra, Angola  
# Armenia, Netherlands, Australia, Austria, Azerbaijan, Bahamas, The, Barbados, Belarus, Belgium, Belize  
# Bhutan, Bolivia, Bosnia & Herzegovina, Botswana, Norway, Colombia, Comoros, Brazil, France, Congo, Dem Rep of the  
# Congo, Rep of the, New Zealand, Brunei, Bulgaria, Burkina Faso, Burundi, Cabo Verde, Cambodia, Cameroon, Canada  
# Costa Rica, Cote d'Ivoire, Croatia, Cuba, Central African Rep, Chad, Chile, China, Cyprus, Czechia  
# Denmark, Djibouti, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea, Eritrea, Estonia  
# Ethiopia, Fiji, Finland, Gabon, Gambia, The, Morocco, Mozambique, Namibia, Georgia, Germany  
# Ghana, Greece, Greenland, Grenada, Nauru, Guatemala, Nepal, Guinea, Guinea-Bissau, Guyana  
# Haiti, Jordan, Honduras, Hungary, Iceland, Indonesia, Iran, Iraq, Ireland, Kazakhstan  
# Kenya, Kiribati, Korea, North, Korea, South, Kosovo, Serbia, Seychelles, Sierra Leone, Singapore, Italy  
# Jamaica, Japan, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein  
# Lithuania, Luxembourg, Monaco, Mongolia, Montenegro, Macedonia, Madagascar, Malawi, Malaysia, Maldives  
# Mali, Malta, Marshall Is, Mauritania, Mauritius, Mexico, Micronesia, Fed States of, Moldova, Nicaragua  
# Oman, Pakistan, Palau, Panama, Papua New Guinea, Paraguay, Peru, Philippines, Poland, Portugal  
# Romania, Russia, Rwanda, Samoa, San Marino, Tonga, Trinidad & Tobago, Tunisia, Turkmenistan, Sao Tome & Principe  
# Saudi Arabia, Senegal, Slovakia, Slovenia, Solomon Is, Somalia, South Africa, South Sudan, Spain, Sri Lanka  
# St Kitts & Nevis, St Lucia, St Vincent & the Grenadines, Sudan, Suriname, Swaziland, Sweden, Switzerland, Syria, Taiwan  
# Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tuvalu, Uganda, Uruguay, Uzbekistan, Vanuatu  
# Vatican City, Venezuela, Vietnam, Zambia, Zimbabwe, Yemen, Ukraine, Bahrain, Kuwait, Qatar  
# United Arab Emirates, Turkey, Israel, Bangladesh, Burma, India, Benin, Niger, Nigeria, Abyei  
# Aksai Chin, CH-IN, Demchok, Dragonja, Dramana-Shakatoe, Falkland Islands (UK), Gaza Strip, Kalapani, Isla Brasilera, Siachen-Saltoro  
# Koualou, Liancourt Rocks, No Man's Land, Paracel Is, Sanafir & Tiran Is., Senkakus, Spratly Is, West Bank, Western Sahara  