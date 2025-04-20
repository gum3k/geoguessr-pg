import os
import csv
from tqdm import tqdm
from scipy.spatial import KDTree
from config import LOOKUP_TRESHOLD

sets_directory = './locations_sets'
output_file = './lookup/street_view_points.csv'

# Convert point to float tuple
def to_float_point(row):
    return (float(row[0]), float(row[1]))

# KDTree wrapper for efficient proximity checking
class ProximitySet:
    def __init__(self):
        self.points = []   # List of (lat, lon)
        self.tree = None   # KDTree

    def rebuild_tree(self):
        if self.points:
            self.tree = KDTree(self.points)

    def is_near(self, point):
        if self.tree is None:
            return False
        distance, _ = self.tree.query(point)
        return distance < LOOKUP_TRESHOLD

    def add_if_not_near(self, point):
        if not self.is_near(point):
            self.points.append(point)
            if len(self.points) % 100 == 0:  # Rebuild every N points
                self.rebuild_tree()
            return True
        return False

    def finalize(self):
        self.rebuild_tree()
        return self.points


proximity_set = ProximitySet()

# Count number of files only once
csv_files = [
    os.path.join(root, file)
    for root, _, files in os.walk(sets_directory)
    for file in files if file.endswith('locations.csv')
]

with tqdm(total=len(csv_files), desc="Processing files", unit="file") as file_pbar:
    for file_path in csv_files:
        with open(file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            next(reader, None)  # Skip header
            points = [to_float_point(row) for row in reader if len(row) >= 2]

        # Filter and insert points using spatial proximity check
        with tqdm(total=len(points), desc=f"Processing points in {os.path.basename(file_path)}", unit="point") as point_pbar:
            for point in points:
                proximity_set.add_if_not_near(point)
                point_pbar.update(1)

        file_pbar.update(1)

# Final sorted output
final_points = sorted(proximity_set.finalize())

os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['Latitude', 'Longitude'])
    writer.writerows(final_points)

print(f"Optimized output written to {output_file}")
