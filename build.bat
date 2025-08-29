@echo off

echo Prebuilding...
call npx expo prebuild
if %errorlevel% neq 0 (
    echo Expo prebuild failed. Exiting.
    pause
    exit /b %errorlevel%
)

echo Building APK file...
cd android
if %errorlevel% neq 0 (
    echo Could not navigate to the android directory. Exiting.
    pause
    exit /b %errorlevel%
)

call gradlew assembleRelease
if %errorlevel% neq 0 (
    echo Gradle build failed.
    cd ..
    pause
    exit /b %errorlevel%
)

cd ..
echo Build process completed successfully.
pause