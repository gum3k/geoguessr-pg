# GeoGuessr Project

This project includes a Node.js website and a Python-based map generator for generating random geographic points and checking Street View coverage with few pre-generated location sets.

## Setup guide

To get started with this project, follow these steps:

1. Navigate to the project directory:
   ```sh
   cd geoguessr-pg
   ```

2. Start the server by double-clicking `start_server.bat` or running it from the command line:
   ```sh
   start_server.bat
   ```

3. Enter Your Valid Google Cloud API Key. It will be used for:
   - Maps JavaScript API: Used to load locations on the website.
   - Street View Static API: Used during map generation to check for Street View coverage.

4. If you want to stop the server, simply press `Ctrl + C` or close the cmd window.


## Usage

Once the server is running, you can access the application at http://localhost:3000.

## Important Notes

- Your API key is securely stored in the [apikey.txt](./apikey.txt) file, which is ignored by Git.
- The APIs in use should not generate any costs. However, it's recommended to check the limits and payment settings in your Google Cloud account for peace of mind.
- If you'd like to modify or update your API key, just follow the instructions when prompted by the script.

---

Enjoy the smooth setup and let the server work its magic! ✨

## Components

### Node.js Website

The Node.js website initializes a server and sets up routes for handling requests. It includes scripts for loading the Google Maps API key and handling interactions with the Google Maps API.

### Map Generator

The map generator is a Python-based application that generates random geographic points across the globe and checks whether Street View coverage is available for those locations using the Google Maps API. It provides options for visualizing generated points and saved locations with Street View coverage.

For detailed information on each component, refer to the README files in their respective directories.