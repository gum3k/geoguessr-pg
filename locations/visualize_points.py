import pandas as pd
import folium

def read_csv():
    df = pd.read_csv('test.csv')  # Adjust path to your CSV file
    return df[['Latitude', 'Longitude']].dropna()

def create_map(points):
    # Create a base map centered at the average of the points
    map_center = [points['Latitude'].mean(), points['Longitude'].mean()]
    m = folium.Map(location=map_center, zoom_start=2)  # Zoom level 2 for global view
    
    for _, row in points.iterrows():
        folium.Marker([row['Latitude'], row['Longitude']]).add_to(m)
    
    m.save('map.html')
    print("Map saved as 'map.html'.")

def main():
    points = read_csv()
    
    create_map(points)

if __name__ == "__main__":
    main()
