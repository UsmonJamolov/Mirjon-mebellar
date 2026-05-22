@echo off
chcp 65001 >nul
echo Mebellar — barcha serverlar...
echo.

echo MongoDB tekshirilmoqda...
netstat -ano | findstr ":27017.*LISTENING" >nul 2>&1
if errorlevel 1 (
  echo MongoDB ishga tushirilmoqda...
  call "%~dp0start-mongodb.bat" silent
  timeout /t 5 /nobreak >nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4000.*LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001.*LISTENING"') do taskkill /F /PID %%a >nul 2>&1

timeout /t 2 /nobreak >nul

start "Mebellar API :4000" cmd /k "cd /d %~dp0mebellar-api && npm run dev"
timeout /t 4 /nobreak >nul
start "Mebellar Admin :3000" cmd /k "cd /d %~dp0 && npm run dev:clean"
timeout /t 3 /nobreak >nul
start "Mebellar Shop :3001" cmd /k "cd /d %~dp0mebellar-shop && npm run dev"

echo.
echo Tayyor:
echo   API:    http://127.0.0.1:4000/api/health
echo   Admin:  http://127.0.0.1:3000
echo   Do'kon: http://127.0.0.1:3001
echo.
echo MongoDB: start-mongodb.bat (Compass uchun)
pause
