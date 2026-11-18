@echo off
echo ========================================================
echo             Starting SnapTag Bulk Watermarker           
echo ========================================================
echo.
echo Ensuring required directories exist...
if not exist "%~dp0uploads" mkdir "%~dp0uploads"
if not exist "%~dp0output" mkdir "%~dp0output"
if not exist "%~dp0tags" mkdir "%~dp0tags"
if not exist "%~dp0frontend\public\hero_section.png" copy "%~dp0Images\hero_section.png" "%~dp0frontend\public\hero_section.png" >nul 2>&1

echo Starting Backend Server on port 3001...
start "SnapTag - Backend API (Port 3001)" cmd /k "cd /d "%~dp0backend" && node server.js"

echo Starting Frontend Dev Server on port 5173...
start "SnapTag - Frontend UI (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Backend API:  http://localhost:3001
echo - Frontend App: http://localhost:5173
echo.
echo You can keep this window or close it.
pause
