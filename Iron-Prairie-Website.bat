@echo off
setlocal
title Iron Prairie Fabrication Group - Dev & Demo Server

echo ========================================================================
echo   IRON PRAIRIE FABRICATION GROUP LLC - LOCAL DEMO & DEV SERVER
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
  if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install encountered an error.
    pause
    exit /b 1
  )
)

REM 3. Launch background browser opener that waits for dev server port
start /b "" powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$port = 5173; $url = 'http://localhost:5173'; " ^
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
  "Start-Process $url"

echo.
echo [✓] Starting Vite Dev Server with Live Hot-Reload...
echo.
echo ------------------------------------------------------------------------
echo   Local Web Links:
echo   • Public Website:          http://localhost:5173/
echo   • ASME Paddle Blinds:      http://localhost:5173/storefront
echo   • ASME Traceability / MTR: http://localhost:5173/traceability
echo ------------------------------------------------------------------------
echo   (*) Changes saved in code will automatically update in your browser.
echo   (*) Press Ctrl+C to stop the server when you are done.
echo ------------------------------------------------------------------------
echo.

call npm run dev

endlocal


