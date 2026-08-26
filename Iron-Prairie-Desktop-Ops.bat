@echo off
setlocal
title Iron Prairie Operations & ASME MTR Platform

echo ========================================================================
echo   IRON PRAIRIE FABRICATION GROUP LLC - DESKTOP OPERATIONS PLATFORM
echo   ASME Section VIII Div 1 & ASME B16.48 Material Traceability Suite
echo ========================================================================
echo.

cd /d "%~dp0"

REM 1. Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js is not found in your PATH.
  echo Please install Node.js (https://nodejs.org) to run this application.
  echo.
  pause
  exit /b 1
)

REM 2. Check if node_modules exists; install if missing
if not exist "node_modules" (
  echo [*] First-time setup detected: Installing npm dependencies...
  call npm install
)

REM 3. Launch background browser opener in Chrome App mode or default browser
start /b "" powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = 5173; $url = 'http://localhost:5173/operations'; " ^
  "for ($i=0; $i -lt 30; $i++) { " ^
  "  Start-Sleep -Milliseconds 500; " ^
  "  try { " ^
  "    $tcp = New-Object System.Net.Sockets.TcpClient; " ^
  "    $async = $tcp.BeginConnect('127.0.0.1', $port, $null, $null); " ^
  "    $wait = $async.AsyncWaitHandle.WaitOne(200, $false); " ^
  "    if ($wait -and $tcp.Connected) { " ^
  "      $tcp.EndConnect($async); " ^
  "      $tcp.Close(); " ^
  "      break; " ^
  "    } " ^
  "    $tcp.Close(); " ^
  "  } catch {} " ^
  "} " ^
  "try { Start-Process 'chrome.exe' -ArgumentList ('--app=' + $url, '--window-size=1920,1080') } catch { Start-Process $url }"

echo.
echo [✓] Launching Operations Suite on http://localhost:5173/operations...
echo.
echo ------------------------------------------------------------------------
echo   (*) Changes saved in code will automatically update in real-time.
echo   (*) Press Ctrl+C in this window to stop the server when finished.
echo ------------------------------------------------------------------------
echo.

call npm run dev

endlocal

