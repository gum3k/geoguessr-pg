@REM filepath: /C:/Studia/___5sem___/Projekt Grupowy/geoguessr-pg/start_server_dev.bat
@echo off
setlocal enabledelayedexpansion

echo WAIT FOR THE APP TO START, http://localhost:3000/ WILL OPEN AUTOMATICALLY
cd app/server
echo Starting the Node.js server...
start cmd /k "npm run dev"
echo Starting the client...
cd ../client
start cmd /k "npm start"

sleep 5

exit