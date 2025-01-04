@echo off
setlocal

rem Check if apikey.txt exists; if not, create it with a placeholder
if not exist apikey.txt (
    echo YOUR_API_KEY_HERE > apikey.txt
)

rem Read the current API key from apikey.txt
set /p API_KEY=<apikey.txt

rem Prompt the user and display the current API key
echo Your API key: %API_KEY%
set /p new_api_key="Press Enter to start or type a new API key: "

rem If the user entered a new API key, update the apikey.txt file
if not "%new_api_key%"=="" (
    set API_KEY=%new_api_key%
    echo %API_KEY% > apikey.txt
    echo API Key updated successfully.
) else (
    echo API Key remains unchanged.
)

rem Launch the website in the browser
start http://localhost:8000/website/

rem Start the Python HTTP server
echo Starting the Python HTTP server...
python website/server.py

pause
exit /b
