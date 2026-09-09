@echo off
cd /d "%~dp0"
call npm.cmd run dev -- --host 127.0.0.1 --port 5187 --strictPort
pause
