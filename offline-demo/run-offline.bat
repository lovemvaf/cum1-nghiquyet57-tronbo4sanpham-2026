@echo off
chcp 65001 >nul
echo Dang khoi dong may chu trinh chieu Offline LAC HONG SO (Cum 1 - NQ57)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-offline.ps1"
pause
