@echo off
echo ========================================
echo   CHUBB PLATFORM - Demarrage
echo ========================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installe ou pas dans le PATH
    pause
    exit /b 1
)

echo [1/3] Demarrage du backend Python (port 8000)...
start "CHUBB Backend" cmd /k "cd /d %~dp0DETECTION-EXTINCTION-CHUBB\backend && python main.py"

timeout /t 3 /nobreak >nul

echo [2/3] Demarrage de Chubb Sketch (port 5173)...
start "CHUBB Sketch" cmd /k "cd /d %~dp0chubb-sketch-app && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Demarrage de la Plateforme (port 3000)...
start "CHUBB Platform" cmd /k "cd /d %~dp0chubb-platform && npm run dev"

echo.
echo ========================================
echo   Tous les serveurs sont demarres!
echo ========================================
echo.
echo   - Plateforme:  http://localhost:3000
echo   - Sketch App:  http://localhost:5173
echo   - Backend 3D:  http://localhost:8000
echo.
echo Appuyez sur une touche pour ouvrir la plateforme...
pause >nul

start http://localhost:3000
