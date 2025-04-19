import pandas as pd
import folium
from folium.plugins import MarkerCluster
from config import *

def read_csv(path):
    df = pd.read_csv(path)
    return df[['Latitude', 'Longitude']].dropna()

def create_map(points, path, name='map.html'):
    map_center = [points['Latitude'].mean(), points['Longitude'].mean()]
    m = folium.Map(location=map_center, zoom_start=2)
    
    marker_cluster = MarkerCluster().add_to(m)
    for _, row in points.iterrows():
        folium.Marker([row['Latitude'], row['Longitude']]).add_to(marker_cluster)
    
    m.save(path + '/' + name)
    print("Map saved as " + name)
    
def visualize_points(maps_path, map_name):
    if VISUALIZE_POINTS:
        points = read_csv(maps_path + map_name + '/points.csv')
        if points.empty:
            print("No points found in the CSV file.")
            return
        create_map(points, path=maps_path + map_name, name='points.html')
    if VISUALIZE_LOCATIONS:
        locations = read_csv(maps_path + map_name + '/locations.csv')
        if locations.empty:
            print("No locations found in the CSV file.")
            return
        create_map(locations, path=maps_path + map_name, name='locations.html')
