from tqdm import tqdm
import aiohttp
import asyncio
import random
from config import *
from utils.file_operations import read_api_key
from utils.points_generation import is_point_in_country
from .street_view_lookup import StreetViewLookup


API_KEY = read_api_key()

STREET_VIEW_METADATA_URL = "https://maps.googleapis.com/maps/api/streetview/metadata"

REQUEST_SEMAPHORE = asyncio.Semaphore(MAX_REQUESTS_PER_SECOND)


async def check_street_view_async(lat, lng, session, retry_limit=RETRIES):
    async with REQUEST_SEMAPHORE:
        retry_count = 0
        original_lat, original_lng = lat, lng
        while retry_count < retry_limit:
            params = {
                'location': f"{lat},{lng}",
                'radius': COVERAGE_SEARCH_RADIUS,
                'key': API_KEY,
                'source': 'outdoor'
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
                    elif response.status == 429:  # rate-limiting
                        logger.warning(f"Rate limit hit for ({lat}, {lng}). Retrying...")
                        return await retry_check_street_view(lat, lng, session)
                    else:
                        logger.error(f"Error {response.status} for ({lat}, {lng})")
                        return False, (lat, lng)
            except Exception as e:
                logger.error(f"Error for location ({lat}, {lng}): {e}")
                return False, (lat, lng)
        return False, (lat, lng)
            
async def retry_check_street_view(lat, lng, session, retries=3, delay=0.1):
    """Retry logic for handling rate-limiting."""
    for attempt in range(retries):
        await asyncio.sleep(delay)
        logger.info(f"Retrying ({lat}, {lng}), attempt {attempt + 1}")
        result = await check_street_view_async(lat, lng, session)
        if result[0]:  # found Street View coverage
            return result
    logger.error(f"Failed to check ({lat}, {lng}) after {retries} retries")
    return False, (lat, lng)

# asynchronous wrapper to call check_street_view for each point
async def check_street_view_wrapper_async(point, session, pbar):
    lat, lng = point
    has_street_view, new_coords = await check_street_view_async(lat, lng, session)
    pbar.update(1)
    return has_street_view, new_coords

async def filter_points_with_street_view_async(points):
    street_view_points = set()

    min_lat, min_lng = float('inf'), float('inf')
    max_lat, max_lng = float('-inf'), float('-inf')

    async with aiohttp.ClientSession() as session:
        with tqdm(total=len(points), desc="Checking Street View", dynamic_ncols=True) as pbar:
            tasks = []
            for point in points:
                tasks.append(check_street_view_wrapper_async(point, session, pbar))

            results = await asyncio.gather(*tasks)

        with tqdm(total=len(results), desc="Filtering Street View Results", dynamic_ncols=True) as filter_pbar:
            for has_street_view, new_coords in results:
                if has_street_view:
                    lat, lng = new_coords
                    if COUNTRY_NAME:
                        if is_point_in_country(lat, lng):
                            street_view_points.add(new_coords)
                        else:
                            filter_pbar.update(1)
                            continue
                    else:
                        street_view_points.add(new_coords)

                    if COUNTRY_NAME:
                        min_lat = min(min_lat, lat)
                        min_lng = min(min_lng, lng)
                        max_lat = max(max_lat, lat)
                        max_lng = max(max_lng, lng)
                filter_pbar.update(1)

    min_point = (min_lat, min_lng) if COUNTRY_NAME and street_view_points else None
    max_point = (max_lat, max_lng) if COUNTRY_NAME and street_view_points else None
    return street_view_points, min_point, max_point


def lookup_street_view_points(points):
    lookup = StreetViewLookup()
    looked_up = []
    remaining = []

    for point in tqdm(points, desc="Filtering points using lookup table"):
        if lookup.is_near(point):
            if COUNTRY_NAME:
                if is_point_in_country(point[0], point[1]):
                    looked_up.append(point)
            else:
                looked_up.append(point)
        else:
            remaining.append(point)

    logger.info(f"Filtered {len(looked_up)} points using the lookup table")
    return looked_up, remaining
