
# Street View Location Generator

This Python-based application generates random geographic points across the globe and checks whether Street View coverage is available for those locations using the Google Maps API. It provides options for visualizing generated points and saved locations with Street View coverage.

## Prerequisites

Before running the script, you'll need to set up a Python virtual environment and install the required dependencies. This ensures that all necessary libraries are properly installed.

### 1. Create a Virtual Environment

First, create a virtual environment to isolate your project dependencies. You can do this directly in **VSCode** or from the command line.

#### In VSCode:

1. **Open the project folder** in VSCode.
2. Open the **integrated terminal** (View → Terminal or `Ctrl + ``).
3. In the terminal, create a virtual environment named `.venv` by running:
   - **Windows**:
     ```bash
     python -m venv .venv
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv .venv
     ```
   This will create a `.venv` folder in your project directory, where the virtual environment and dependencies will be stored.

4. Once the environment is created, **activate the virtual environment**:
   - **On Windows**:
     ```bash
     .\.venv\Scripts\activate
     ```
   - **On macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```

5. **VSCode will prompt you** to select a Python interpreter. You can also manually select it using the following steps:

   - Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on macOS) to open the **Command Palette**.
   - Type **Python: Select Interpreter** and press Enter.
   - A list of available interpreters will appear. Select the one located in `.venv` (it should be listed as `.venv/bin/python` on macOS/Linux or `.venv\Scripts\python` on Windows).


#### Using the Command Line (Optional):

Alternatively, you can set up the virtual environment from the command line (outside of VSCode).

1. Open the terminal and navigate to your project directory.
2. Create a virtual environment with:
   - **Windows**:
     ```bash
     python -m venv .venv
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv .venv
     ```
3. Activate the virtual environment:
   - **On Windows**:
     ```bash
     .\.venv\Scripts\activate
     ```
   - **On macOS/Linux**:
     ```bash
     source .venv/bin/activate
     ```

### 2. Install Dependencies

Once the virtual environment is activated, install the required dependencies by running:

```bash
pip install -r requirements.txt
```

The `requirements.txt` file contains all the Python libraries needed to run the application, including:

- `shapely`
- `requests`
- `geopandas`
- `aiohttp`
- `tqdm`
- `concurrent.futures`
- `visualize_points` (Custom visualization module)
- Any other necessary packages

## Setting Up Google API Key

This application uses the **Google Maps API** for checking Street View coverage. You will need to create a Google Cloud account and generate an API key with access to the following Google Maps APIs:

- Maps JavaScript API
- Street View Static API

Once you have your API key, create a file called `apikey.txt` in the root directory and paste your API key inside.

### Example `apikey.txt`:

```
YOUR_GOOGLE_API_KEY
```

## Running the Application

### 1. Execute `generator.py`

To launch the application, simply execute 'generator.py'. It will perform the following:

- Read the API key from `apikey.txt`
- Generate random points on the globe
- Check for Street View coverage for each point
- Optionally visualize points or locations with Street View coverage
- Save results to CSV files
- Save map information to a text file

### 2. Map Configuration Parameters

You can adjust the map generation parameters by modifying the following settings in the script:

- `BOUNDS`: Define the bounds for the area to search. Default is the entire Earth.
- `POINT_DEGREE_BUFFER`: Set the buffer distance around the point to check if it's on land.
- `SAMPLES`: Specify how many points to generate.
- `COVERAGE_SEARCH_RADIUS`: Radius of the area to search for Street View coverage (in meters).
- `MAX_REQUESTS_PER_SECOND`: Maximum number of requests allowed to the Google API per second.
- `RETRIES`: Number of retries when a location doesn't have Street View coverage.

### 3. CSV Data and Map Files

Once the points are generated, the results are saved to CSV files:

- **points.csv**: Contains the generated points (latitude, longitude).
- **locations.csv**: Contains the points that have Street View coverage.

These files will be saved in the `locations_sets/` directory, with a subdirectory for each map you generate (based on the `MAP_NAME` setting).

### 4. Visualizing Points

The application can visualize the generated points and the locations with Street View coverage using the `visualize_points` module. You can enable this by setting the flags `VISUALIZE_POINTS` and `VISUALIZE_LOCATIONS` in the script.

## Customizing and Modifying

You can modify various parts of the code to suit your needs. For example:

- Change the map bounds to focus on a specific area.
- Adjust the number of samples to generate more or fewer points.
- Visualize the points or the locations on a map using the `visualize_points` function.

## Additional Notes

- **Rate Limiting**: The script respects the rate limits imposed by the Google Maps API by using a semaphore to ensure that requests are made within the allowed rate.
- **Logging**: The script has a built-in logging feature that you can enable or disable by setting the `LOGGING` flag.
- **Official and Unofficial Coverage**: You can choose to include unofficial coverage (such as from other sources) by setting the `UNOFFICIAL_COVERAGE` flag.