@REM filepath: /C:/Studia/___5sem___/Projekt Grupowy/geoguessr-pg/start_server.bat
@echo off
setlocal enabledelayedexpansion

rem Display the current API key and ask the user if they want to change it
if exist apikey.txt (
    set /p API_KEY=<apikey.txt
    echo Your current API key is: !API_KEY!
) else (
    echo No API key found.
)

set /p new_api_key="Press Enter to start or type a new API key: "

rem If the user entered a new API key, update the apikey.txt file
if not "!new_api_key!"=="" (
    set API_KEY=!new_api_key!
    echo !API_KEY! > apikey.txt
    echo API Key updated successfully.
) else (
    echo API Key remains unchanged.
)

echo Installing dependencies...
cd nodejs-website
call npm install
echo Starting the Node.js server...
start http://localhost:3000
echo:
echo ############################################
echo ############################################
echo:
echo NOW U CAN USE DEV VERSION FOR FASTER STARTUP
echo:
echo ############################################
echo ############################################
echo:
call npm start

pause