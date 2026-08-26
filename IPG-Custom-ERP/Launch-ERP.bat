@echo off
title Iron Prairie Group - Custom Industrial ERP
echo ========================================================================
echo   IRON PRAIRIE GROUP LLC - CUSTOM INDUSTRIAL ERP PLATFORM
echo   Bay City Fabrication Hub & ASME Section VIII Div 1 Suite
echo ========================================================================
echo.
echo Host Directory: C:\Users\micha\Desktop\Iron-Prairie-Website
echo ERP Subdirectory: C:\Users\micha\Desktop\Iron-Prairie-Website\IPG-Custom-ERP
echo.
echo Starting IPG Custom ERP System (Port 5174)...
echo.

start "" "chrome.exe" --app=http://localhost:5174 --window-size=1920,1080

if %ERRORLEVEL% NEQ 0 (
  start http://localhost:5174
)

npm run dev
