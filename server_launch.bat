@echo off
setlocal enabledelayedexpansion

rem Check if apikey.txt exists; if not, create it with a placeholder
if not exist apikey.txt (
    echo AIzaSyBrI_bZTLQhViRpIPQW5r9fwlgqs80Jz9A > apikey.txt
    echo U got blessed with gum3k's API Key, use it wisely.
)

rem Read the current API key from apikey.txt
set /p API_KEY=<apikey.txt

rem Prompt the user and display the current API key
echo Your current API key is: !API_KEY!
set /p new_api_key="Press Enter to start or type a new API key: "

rem If the user entered a new API key, update the apikey.txt file
if not "!new_api_key!"=="" (
    set API_KEY=!new_api_key!
    echo !API_KEY! > apikey.txt
    echo API Key updated successfully.
) else (
    echo API Key remains unchanged.
)

rem Start the Python HTTP server
echo Starting the Python HTTP server...
start python website/server.py

rem Launch the website in the browser
start http://localhost:8000/website/

exit /b
