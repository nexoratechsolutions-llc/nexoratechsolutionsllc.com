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
echo  [i] Starting Vite. Your browser opens automatically once it is ready.
echo  [i] Vite prefers port 5173; if another app is using it, the next free
echo      port is used and the address is printed below.
echo  [i] Press Ctrl+C in this window to stop the server.
echo.

call npm run dev -- --open

echo.
echo  [i] Dev server stopped.
pause
endlocal
