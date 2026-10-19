@echo off
title Medicare HMS Launcher
echo Launching Backend Server...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo Launching Frontend Client...
start cmd /k "cd frontend && npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:5173
