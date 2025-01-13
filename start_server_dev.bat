@REM filepath: /C:/Studia/___5sem___/Projekt Grupowy/geoguessr-pg/start_server_dev.bat
@echo off
setlocal enabledelayedexpansion

cd nodejs-website
echo Not installing dependencies...
echo Starting the Node.js server...
start http://localhost:3000
call npm start

pause