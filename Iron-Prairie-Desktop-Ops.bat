@echo off
title Iron Prairie Operations & ASME MTR Platform
echo ========================================================================
echo   IRON PRAIRIE FABRICATION GROUP LLC - DESKTOP OPERATIONS PLATFORM
echo   ASME Section VIII Div 1 & ASME B16.48 Material Traceability Suite
echo ========================================================================
echo.
echo Launching Dedicated Desktop Operations App (Chrome App Mode)...

start "" "chrome.exe" --app=http://localhost:5173/operations --window-size=1920,1080

if %ERRORLEVEL% NEQ 0 (
  echo Chrome app mode launcher opening default browser...
  start http://localhost:5173/operations
)

echo Operations Platform Launched.
