@echo off
echo Starting Hospital Management System (HMS)...

:: Start ML Service
echo [1/3] Starting ML Service...
start "ML Service" cmd /k "cd python-ml-service && venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8000"

:: Start Backend
echo [2/3] Starting Spring Boot Backend (H2)...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

:: Start Frontend
echo [3/3] Starting Next.js Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting in separate windows.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080
echo ML Service: http://localhost:8000
echo.
echo Happy coding!
pause
