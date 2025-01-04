import pandas as pd
import folium
from folium.plugins import MarkerCluster

def read_csv(path):
    df = pd.read_csv(path)  # Adjust path to your CSV file
    return df[['Latitude', 'Longitude']].dropna()

def create_map(points, name='map.html'):
    # Create a base map centered at the average of the points
    map_center = [points['Latitude'].mean(), points['Longitude'].mean()]
    m = folium.Map(location=map_center, zoom_start=2)  # Zoom level 2 for global view
    
    marker_cluster = MarkerCluster().add_to(m)
    for _, row in points.iterrows():
        folium.Marker([row['Latitude'], row['Longitude']]).add_to(marker_cluster)
    
    m.save(name)
    print("Map saved as " + name)

def main():
    points = read_csv('locations_sets/generated_locations.csv')
    create_map(points)
    
    points = read_csv('locations_sets/equally_distributed_world_points.csv')
    create_map(points, 'map_points.html')
    

if __name__ == "__main__":
    main()
