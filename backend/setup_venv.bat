@echo off
REM Setup script for Python Virtual Environment

setlocal enabledelayedexpansion

echo ===================================================
echo   Hybrid Prediction System - Backend Setup
echo ===================================================
echo.

REM 1. Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found on your system PATH.
    echo Please make sure Python is installed and added to your System PATH.
    echo You can download Python from https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

for /f "tokens=2" %%I in ('python --version 2^>^&1') do set PY_VER=%%I
echo [INFO] Found Python version: %PY_VER%

REM 2. Create the virtual environment
echo [INFO] Creating virtual environment in 'venv' directory...
python -m venv venv
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to create the virtual environment.
    echo Trying with alternative launcher (py)...
    py -m venv venv
    if !errorlevel! neq 0 (
        echo [ERROR] Virtual environment creation failed with both 'python' and 'py'.
        pause
        exit /b 1
    )
)

echo [SUCCESS] Virtual environment 'venv' created successfully.
echo.

REM 3. Upgrade pip in the virtual environment
echo [INFO] Upgrading pip inside the virtual environment...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
if %errorlevel% neq 0 (
    echo [WARNING] Failed to automatically upgrade pip, but the virtual environment is ready.
) else (
    echo [SUCCESS] pip upgraded successfully.
)
echo.

echo ===================================================
echo   Virtual Environment Ready!
echo ===================================================
echo To activate the virtual environment, run:
echo   .\venv\Scripts\activate
echo.
echo To deactivate, run:
echo   deactivate
echo ===================================================
echo.

pause
