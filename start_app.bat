@REM filepath: /C:/Studia/___5sem___/Projekt Grupowy/geoguessr-pg/start_server.bat
@echo off
setlocal enabledelayedexpansion

rem Display the current API key and ask the user if they want to change it
if exist apikey.txt (
    set /p API_KEY=<apikey.txt
    echo Your current API key is: !API_KEY!
) else (
    echo AIzaSyBrI_bZTLQhViRpIPQW5r9fwlgqs80Jz9A > apikey.txt
    echo U got blessed with gum3k's API Key, use it wisely.
    echo It's possible that gum3k will change or remove it in the future, so be prepared.
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

echo WAIT FOR THE DEPENDENCIES TO INSTALL AND FOR THE APP TO START, http://localhost:3000/ WILL OPEN AUTOMATICALLY
echo Installing dependencies...
cd app/client
call npm config set legacy-peer-deps true
call npm install
cd ../server
call npm install
echo Starting the Node.js server...
start cmd /k "npm run dev"
echo Starting the client...
cd ../client
start cmd /k "npm start"

echo:
echo ############################################
echo ############################################
echo:
echo NOW U CAN USE DEV VERSION FOR FASTER STARTUP
echo:
echo ############################################
echo ############################################
echo:

sleep 5

exit