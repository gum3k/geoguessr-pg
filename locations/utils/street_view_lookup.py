import csv
import numpy as np
from scipy.spatial import KDTree
from config import LOOKUP_TRESHOLD, LOOKUP_PATH

class StreetViewLookup:
    def __init__(self, csv_path=LOOKUP_PATH, threshold=LOOKUP_TRESHOLD):
        self.threshold = threshold
        self.points = self._load_points(csv_path)
        self.tree = KDTree(self.points) if len(self.points) > 0 else None

    def _load_points(self, path):
        with open(path, 'r', newline='', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader, None)  # skip header
            return np.array([[float(lat), float(lng)] for lat, lng in reader], dtype=np.float64)

    def is_near(self, point):
        if self.tree is None:
            return False
        distance, _ = self.tree.query(point)
        return distance < self.threshold
