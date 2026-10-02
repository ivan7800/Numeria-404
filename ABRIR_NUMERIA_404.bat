@echo off
TITLE Numeria 404 V2
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  python -m http.server 8080
  goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8080
  py -m http.server 8080
  goto :eof
)
echo.
echo No se ha encontrado Python.
echo Puedes usar cualquier servidor HTTP local, por ejemplo:
echo   npx serve .
echo.
pause
