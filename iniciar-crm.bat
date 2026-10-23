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

echo Abriendo navegador en http://localhost:3000...
start "" "http://localhost:3000"

echo Iniciando servidor de desarrollo Next.js...
npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar el servidor.
    pause
)
