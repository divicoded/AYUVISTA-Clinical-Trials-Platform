# AYUVISTA - Prototype Startup Script
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   AYUVISTA - Clinical Research & Pharmacovigilance    " -ForegroundColor White
Write-Host "=======================================================" -ForegroundColor Cyan

$pythonExe = "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"
if (-not (Test-Path $pythonExe)) {
    $pythonExe = "python"
}

Write-Host "Starting Backend FastAPI on http://localhost:8000 ..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath $pythonExe -ArgumentList "-m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -WorkingDirectory "d:\Project\AIIA\backend" -PassThru

Write-Host "Starting Frontend Vite on http://localhost:5173 ..." -ForegroundColor Yellow
$frontendJob = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "d:\Project\AIIA\frontend" -PassThru

Write-Host "`nAll services active!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API: http://localhost:8000/docs" -ForegroundColor White
Write-Host "`nDemo Accounts (Password: Nexus@AIIA2026):" -ForegroundColor Cyan
Write-Host "  PI:             pi@aiia.demo"
Write-Host "  Coordinator:    coordinator@aiia.demo"
Write-Host "  Monitor (CRA):  monitor@aiia.demo"
Write-Host "  Ethics (IEC):   ethics@aiia.demo"
Write-Host "  Safety / PV:    pv@aiia.demo"
Write-Host "  Leadership:     leadership@aiia.demo"
Write-Host "  Regulator:      regulator@aiia.demo"
Write-Host "  Admin:          admin@aiia.demo"

Write-Host "`nPress Ctrl+C or close this terminal to stop services."
Wait-Process -Id $backendJob.Id
