@echo off
title Mercury Creation and Design - CRM Local
color 0B
cls
echo ========================================================
echo   MERCURY CREATION AND DESIGN - CRM ENTERPRISE LOCAL
echo ========================================================
echo   Base de Datos : PostgreSQL 17 (localhost:5432)
echo   Canales       : Meta Ads, Instagram, LinkedIn, X, Correo
echo   URL Web       : http://localhost:3000
echo ========================================================
echo.
echo Posicionando en el directorio del CRM...
cd /d "C:\Proyectos\cmr"

echo.
echo Iniciando servidor Next.js...
echo El navegador se abrira automaticamente en unos segundos...
echo.

:: Espera 3 segundos en segundo plano antes de abrir el navegador para dar tiempo a que Next.js levante el puerto 3000
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar el servidor de Next.js.
    pause
)
