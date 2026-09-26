@echo off
setlocal
title Nexora TechSolutions - Production Build
cd /d "%~dp0"

echo.
echo  ==========================================
echo   NEXORA TECHSOLUTIONS - Production Build
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [X] Node.js was not found on your PATH.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo  [i] Installing dependencies first...
  call npm install
  if errorlevel 1 (
    echo  [X] npm install failed.
    pause
    exit /b 1
  )
)

echo  [i] Building to .\dist ...
echo.
call npm run build
if errorlevel 1 (
  echo.
  echo  [X] Build failed. Scroll up for the error.
  pause
  exit /b 1
)

echo.
echo  [OK] Build complete - output is in .\dist
echo  [i] Serving the production build on http://localhost:4173
echo  [i] Press Ctrl+C to stop.
echo.

start "" http://localhost:4173
call npm run preview

pause
endlocal
