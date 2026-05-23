@echo off
echo ==============================================
echo    Starting TechZone E-Commerce Platform
echo ==============================================
echo.

:: Start MongoDB Database in the background
echo [1/2] Starting local MongoDB Database...
start /min "MongoDB Server" mongod --dbpath C:\data\db --port 27017

:: Wait 3 seconds to let MongoDB start
timeout /t 3 /nobreak > nul

:: Start Backend and Frontend concurrently
echo [2/2] Starting Backend (Port 5000) and Frontend (Port 5173)...
npm run dev
