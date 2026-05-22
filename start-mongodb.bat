@echo off
title Mebellar MongoDB
chcp 65001 >nul

netstat -ano | findstr ":27017.*LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo MongoDB allaqachon ishlayapti ^(port 27017^).
  goto :done
)

echo MongoDB ishga tushirilmoqda (port 27017)...
if not exist "%~dp0data\mongodb" mkdir "%~dp0data\mongodb"

set "MONGOD=C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
if not exist "%MONGOD%" set "MONGOD=C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
if not exist "%MONGOD%" (
  echo XATO: mongod.exe topilmadi. MongoDB o'rnating yoki Windows xizmatini yoqing.
  pause
  exit /b 1
)

start "" "%MONGOD%" --config "%~dp0mongod-local.cfg"
timeout /t 4 /nobreak >nul

netstat -ano | findstr ":27017.*LISTENING" >nul 2>&1
if errorlevel 1 (
  echo XATO: MongoDB ishga tushmadi. data\mongod.log ni tekshiring.
  pause
  exit /b 1
)

:done
echo.
echo Compass: mongodb://127.0.0.1:27017/m-mebellar
echo Tayyor.
if /i "%~1" neq "silent" pause
