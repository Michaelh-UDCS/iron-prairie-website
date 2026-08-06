@echo off
setlocal

cd /d "%~dp0"

REM Install dependencies if node_modules does not exist
if not exist "node_modules" (
  echo Installing npm dependencies for Iron Prairie Website...
  npm install
)

REM Start the dev server and open the browser
echo Starting Iron Prairie Website dev server on http://localhost:5173
start "" http://localhost:5173
npm run dev

endlocal

