@echo off
setlocal

REM Get the directory where this batch file is located
set SCRIPT_DIR=%~dp0
REM Change current directory to the script's directory
cd /d "%SCRIPT_DIR%"

REM --- Configuration ---
set PYTHON_EXE=python
set VENV_DIR=venv_math_homework
set REQUIREMENTS_FILE=requirements.txt
set PYTHON_SCRIPT=math_question.py

REM --- Check for Python ---
echo Checking for Python installation...
%PYTHON_EXE% --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not found in PATH.
    echo Please install Python (e.g., from python.org) and ensure it's added to your PATH.
    goto End
)
echo Python found.

REM --- Setup/Activate Virtual Environment ---
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo Creating virtual environment in "%VENV_DIR%"...
    %PYTHON_EXE% -m venv "%VENV_DIR%"
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment. Please check Python installation and permissions.
        goto End
    )
    echo Virtual environment created.
)

echo Activating virtual environment...
call "%VENV_DIR%\Scripts\activate.bat"
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment.
    goto End
)

REM --- Install Dependencies ---
if not exist "%REQUIREMENTS_FILE%" (
    echo ERROR: "%REQUIREMENTS_FILE%" not found in "%SCRIPT_DIR%".
    echo Please ensure "%REQUIREMENTS_FILE%" is in the same directory as this batch script.
    goto End
)

echo Installing/Verifying dependencies from "%REQUIREMENTS_FILE%"...
pip install -r "%REQUIREMENTS_FILE%"
if errorlevel 1 (
    echo ERROR: Failed to install dependencies. 
    echo Check your internet connection, "%REQUIREMENTS_FILE%", and permissions.
    echo You might need to run this script as an administrator.
    goto End
)
echo Dependencies are up to date.

REM --- Run the Python Script ---
if not exist "%PYTHON_SCRIPT%" (
    echo ERROR: Python script "%PYTHON_SCRIPT%" not found in "%SCRIPT_DIR%".
    echo Please ensure "%PYTHON_SCRIPT%" is in the same directory as this batch script.
    goto End
)

echo Running Python script "%PYTHON_SCRIPT%"...
%PYTHON_EXE% "%PYTHON_SCRIPT%"
if errorlevel 1 (
    echo ERROR: Python script execution failed. Check the console for Python error messages.
    goto End
)

echo.
echo Script "%PYTHON_SCRIPT%" executed successfully.
echo The PDF file (e.g., math_homework_add_subtract.pdf) should be generated in the current directory:
echo "%SCRIPT_DIR%"

:End
echo.
pause
endlocal