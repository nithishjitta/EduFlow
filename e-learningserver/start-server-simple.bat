@echo off
echo Starting E-Learning Server (without MongoDB)...
cd C:\Users\Manish\Downloads\e-learningserver

if not exist "target\elearning-server-1.0.0.jar" (
    echo JAR file not found. Building application...
    call .\mvnw clean package -DskipTests -q
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
    echo Build successful.
)

echo Starting Spring Boot application...
java -jar target\elearning-server-1.0.0.jar

if errorlevel 1 (
    echo Application failed to start!
    echo This might be due to MongoDB not running or other configuration issues.
    echo Please check that MongoDB is running on localhost:27017
) else (
    echo Application started successfully!
)

pause
