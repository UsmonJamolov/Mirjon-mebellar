@echo off
title Mebellar MongoDB
echo MongoDB ishga tushirilmoqda (port 27017)...

if not exist "%~dp0data\mongodb" mkdir "%~dp0data\mongodb"

start "" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --config "%~dp0mongod-local.cfg"

timeout /t 4 /nobreak >nul
echo.
echo Compass da ulanish: mongodb://localhost:27017
echo Oyna yopilsa ham MongoDB fon rejimida ishlaydi.
pause
