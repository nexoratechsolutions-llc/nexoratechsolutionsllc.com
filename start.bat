@echo off
setlocal
title Nexora TechSolutions - Dev Server
cd /d "%~dp0"

echo.
echo  ==========================================
echo   NEXORA TECHSOLUTIONS - Development
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [X] Node.js was not found on your PATH.
  echo      Install Node 18 or newer from https://nodejs.org and run this again.
  echo.
  pause
  exit /b 1
)

for /f "delims=" %%v in ('node --version') do echo  [i] Node %%v

if not exist "node_modules" (
  echo  [i] First run - installing dependencies. This takes a minute...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo  [X] npm install failed. Scroll up for the reason.
    pause
    exit /b 1
  )
  echo.
  echo  [OK] Dependencies installed.
)

echo.
echo  [i] Starting Vite on http://localhost:5173
echo  [i] The /api routes are served too, so the forms work here.
echo  [i] Press Ctrl+C in this window to stop the server.
echo.

start "" http://localhost:5173
call npm run dev

echo.
echo  [i] Dev server stopped.
pause
endlocal
