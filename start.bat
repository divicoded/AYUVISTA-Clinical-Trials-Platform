@echo off
title AIIA NEXUS Prototype Runner
echo =======================================================
echo    AIIA NEXUS - Clinical Research Operations Platform
echo =======================================================

echo Starting Backend FastAPI on http://localhost:8000 ...
start "AIIA Nexus Backend" cmd /k "cd /d %~dp0backend && "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend Vite on http://localhost:5173 ...
start "AIIA Nexus Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo Both servers are starting in separate windows!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo.
pause
