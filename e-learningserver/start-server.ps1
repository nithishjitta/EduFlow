Write-Host "Starting E-Learning Server..." -ForegroundColor Green
Set-Location "C:\Users\Manish\Downloads\e-learningserver"
if (Test-Path "target\elearning-server-1.0.0.jar") {
    Write-Host "JAR file found, starting application..." -ForegroundColor Yellow
    java -jar target\elearning-server-1.0.0.jar
} else {
    Write-Host "JAR file not found. Building application first..." -ForegroundColor Red
    .\mvnw clean package -DskipTests
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build successful, starting application..." -ForegroundColor Green
        java -jar target\elearning-server-1.0.0.jar
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
    }
}
Read-Host "Press Enter to exit"
