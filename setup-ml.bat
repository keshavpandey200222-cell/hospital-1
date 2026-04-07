@echo off
echo Setting up Python environment for ML Service...

cd python-ml-service

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo ML Service setup complete!
pause
