@echo off
echo ======================================================
echo   HOSPITAL MANAGEMENT SYSTEM - LIVE LINK GENERATOR
echo ======================================================
echo.
echo [!] IMPORTANT: You will need your Public IP Address to log in.
echo Visit https://ipv4.icanhazip.com to find it.
echo.

:: Start Frontend Tunnel
start "HMS Frontend" cmd /k "lt --port 3000"

:: Start Backend Tunnel
start "HMS Backend" cmd /k "lt --port 8080"

:: Start ML Service Tunnel
start "HMS ML Service" cmd /k "lt --port 8000"

echo.
echo ------------------------------------------------------
echo [SUCCESS] 3 Tunnels are launching in separate windows.
echo ------------------------------------------------------
echo 1. Copy the .loca.lt URL from each window.
echo 2. When prompted for a password, enter your Public IP.
echo 3. Update the Frontend to use the Backend's new URL if needed.
echo.
pause
