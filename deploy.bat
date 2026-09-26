@echo off
setlocal
title Nexora TechSolutions - Deploy to Vercel
cd /d "%~dp0"

echo.
echo  ==========================================
echo   NEXORA TECHSOLUTIONS - Deploy to Vercel
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo  [X] Node.js was not found on your PATH.
  pause
  exit /b 1
)

where vercel >nul 2>nul
if errorlevel 1 (
  echo  [i] Vercel CLI not found. Installing it globally...
  call npm install -g vercel
  if errorlevel 1 (
    echo  [X] Could not install the Vercel CLI.
    pause
    exit /b 1
  )
)

echo.
echo  Choose a target:
echo    [1] Preview deployment  (a throwaway URL)
echo    [2] Production          (your live domain)
echo    [3] Local dev on Vercel  (vercel dev - optional; npm run dev also serves /api)
echo.
set /p choice="  Enter 1, 2 or 3: "

if "%choice%"=="1" goto preview
if "%choice%"=="2" goto production
if "%choice%"=="3" goto localdev

echo  [X] Not a valid choice.
pause
exit /b 1

:preview
echo.
echo  [i] Deploying a preview build...
call vercel
goto done

:production
echo.
echo  [!] This publishes to your PRODUCTION domain.
set /p confirm="  Type YES to continue: "
if /i not "%confirm%"=="YES" (
  echo  [i] Cancelled - nothing was deployed.
  pause
  exit /b 0
)
echo  [i] Deploying to production...
call vercel --prod
goto done

:localdev
echo.
echo  [i] Starting vercel dev on http://localhost:3000
echo  [i] Runs the site the way Vercel will. For day-to-day work, start.bat is enough.
echo.
start "" http://localhost:3000
call vercel dev
goto done

:done
echo.
echo  [i] Finished.
pause
endlocal
