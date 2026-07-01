@echo off
title Ticketing App

echo ========================================
echo        Lancement Ticketing App
echo ========================================
echo.

node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ERREUR : Node.js n'est pas installe.
    echo Installez Node.js puis relancez ce fichier.
    echo https://nodejs.org
    pause
    exit
)

echo Node.js detecte.
echo.

IF NOT EXIST backend\node_modules (
    echo Installation des dependances backend...
    cd backend
    call npm install
    cd ..
) ELSE (
    echo Dependances backend deja installees.
)

echo.

IF NOT EXIST frontend\node_modules (
    echo Installation des dependances frontend...
    cd frontend
    call npm install
    cd ..
) ELSE (
    echo Dependances frontend deja installees.
)

echo.

IF NOT EXIST backend\.env (
    echo Creation du fichier .env...
    echo PORT=3000> backend\.env
    echo DB_HOST=localhost>> backend\.env
    echo DB_USER=root>> backend\.env
    echo DB_PASSWORD=>> backend\.env
    echo DB_NAME=ticketing>> backend\.env
    echo JWT_SECRET=ticketing_secret_key>> backend\.env
) ELSE (
    echo Fichier .env deja existant.
)

echo.
echo Lancement du backend...
start cmd /k "cd backend && npm start"

timeout /t 3 >nul

echo Lancement du frontend...
start cmd /k "cd frontend && npm run dev"

timeout /t 5 >nul

echo Ouverture de l'application...
start http://localhost:5173

echo.
echo Application lancee.
pause